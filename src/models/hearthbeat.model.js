import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
    'HearthBeat',
    mongoose.Schema({
        ip_mac: {
            type: String,
            required: true,
            unique: true,
        },
        name_device: {
            type: String,
            required: true,
        },
        hospital_id: {
            type: Schema.Types.ObjectId,
            ref: "Hospital",
        },
        status: {
            type: Boolean,
            required: true,
        },
        patient_cccd: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        }
    }, modelOptions)
)