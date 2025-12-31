import mongoose from "mongoose";

const effortRecordSchema = new mongoose.Schema({
    name : {
        type: String,
        unique : true,
        required : [true, 'A name is required']
    },
    description : {
        type : String,
        reqired : false
    },
    startDate : {
        type: Date,
        required: true,
    },
    endDate : {
        type: Date,
        required: true,
    }
}, { timestamps: true });

const EffortRecord = mongoose.model('EffortRecord', effortRecordSchema);
export default EffortRecord;