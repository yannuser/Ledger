import mongoose from "mongoose";

const effortRecordSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true, // Be careful: this means no two efforts can have the same name ever
        required: [true, 'A name is required']
    },
    description: {
        type: String,
        required: false
    },
    goal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LearningGoal',
        required: false // Optional link
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // Every effort must belong to someone
    }
}, { timestamps: true });

const EffortRecord = mongoose.model('EffortRecord', effortRecordSchema);
export default EffortRecord;