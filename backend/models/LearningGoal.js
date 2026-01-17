import mongoose from "mongoose";

const learningGoalSchema = new mongoose.Schema({
    title : {
        type: String,
        unique : true,
        required : [true, 'A name is required']
    },
    description : {
        type : String,
        required : false
    },
    status: {
        type: String,
        enum: ['ongoing', 'paused', 'finished'], // Allowed options
        default: 'ongoing',
        required : true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Must match the name used in mongoose.model('User', ...)
        required: true
    },
    efforts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LearningEffort'
    }]
}, {timestamps: true});

const LearningGoal = mongoose.model('LearningGoal', learningGoalSchema);
export default LearningGoal;
