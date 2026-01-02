import mongoose from "mongoose";

const learningGoalSchema = new mongoose.Schema({
    title : {
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
    }
}, {timestamps: true});

const LearningGoal = mongoose.model('LearningGoal', learningGoalSchema);
export default LearningGoal;