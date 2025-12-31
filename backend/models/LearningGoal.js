import mongoose from "mongoose";

const learningGoalSchema = new mongoose.Schema({
    name : {
        type: String,
        unique : true,
        required : [true, 'A name is required']
    },
    description : {
        type : String,
        reqired : false
    },
    status: {
        type: String,
        enum: ['ongoing', 'paused', 'finished'], // Allowed options
        default: 'ongoing',
        required : true,
    },
    startDate : {
        type: Date,
        required: true,
    },
    endDate : {
        type: Date,
        required: true,
    }
}, {timestamps: true});

const LearningGoal = mongoose.model('LearningGoal', learningGoalSchema);
export default LearningGoal;