import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
    "MedicalRecord",
    mongoose.Schema({
        patient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        doctor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        condition: {
            type: String,
            required: true,
        },
        treatment: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    }, modelOptions)
)