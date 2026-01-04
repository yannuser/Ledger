import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'A first name is required.'],
        trim: true
    },

    lastname: {
        type: String,
        required: [true, 'A last name is required.'], 
        trim: true
    },

    dateOfBirth: {
        type: Date,
        required: false
    },

    email : {
        type: String,
        required: [true, 'An email address is required.'],
        unique: true,
        lowercase: true,
        trim: true,
        validation: {
            validator: function(v) {
                // A simple regex check
                return /^.+@.+\..+$/.test(v); 
            },
            message: props => `${props.value} is not a valid email address!`
        }
    }, 
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Must be at least 8 characters long"],
        validate: {
            validator: function (value) {
            // Custom validation logic
            return (
                /[A-Z]/.test(value) && // At least one uppercase letter
                /[a-z]/.test(value) && // At least one lowercase letter
                /[0-9]/.test(value) && // At least one digit
                /[!@#$%^&*]/.test(value) // At least one special character
            );
            },
            message:
            "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character from !@#$%^&*",
        },

    }}, 

    {
    timestamps: true // This option automatically adds createdAt and updatedAt fields
    }
);

userSchema.pre('findOneAndDelete', async function(next) {
    // This catches the ID regardless of which delete method was called
    const userId = this.getQuery()._id; 
    
    try {
        // We use the LearningGoal model to wipe out all goals with this author ID
        await mongoose.model('LearningGoal').deleteMany({ author: userId });
        next();
    } catch (err) {
        next(err);
    }
});

const User = mongoose.model('User', userSchema);
export default User;