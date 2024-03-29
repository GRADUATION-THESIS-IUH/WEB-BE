import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
    "Warning",
    mongoose.Schema({
        warning: {
            type: String,
            required: true,
        },
        ip_mac: {
            type: String,
            required: true,
        },
        patient_cccd: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        }
    }, modelOptions)
)