import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
    "BeatAvg",
    mongoose.Schema({
        ip_mac: {
            type: String,
            required: true,
        },
        avg: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        patient_cccd: {
            type: String,
            required: true,
        },
    }, modelOptions)
)