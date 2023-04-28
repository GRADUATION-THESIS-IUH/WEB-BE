import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
    "Patient",
    mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        gender: {
            type: Number,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        CCCD: {
            type: String,
            required: true,
            unique: true,
        },
        hospital_id: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            required: true,
        },
    }, modelOptions)
)