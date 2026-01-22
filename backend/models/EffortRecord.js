import mongoose from "mongoose";

const effortRecordSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true, 
        required: [true, 'A name is required']
    },
    description: {
        type: String,
        required: false
    },
    goal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LearningGoal',
        required: false 
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    }
}, { timestamps: true });

const EffortRecord = mongoose.model('EffortRecord', effortRecordSchema);
export default EffortRecord;