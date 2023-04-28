import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
    "MedicalRecord",
    mongoose.Schema({
        patient: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        doctor: {
            type: Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },
        hospital: {
            type: Schema.Types.ObjectId,
            ref: "Hospital",
            required: true,
        },
        date_start: {
            type: Date,
            required: true,
        },
        date_end: {
            type: Date,
            required: true,
        },
        iot_id: {
            type: Schema.Types.ObjectId,
            ref: "HearthBeat",
            required: true,
        },
        vital_signs: {
            type: Array,
            required: true,
        },
        target: {
            type: Number,
        },
        description: {
            type: String,
        },
        status: {
            type: Number,
            required: true,
        },
    }, modelOptions)
)