import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
    "Doctor",
    mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        specialist: {
            type: String,
            required: true,
        },
        email: 
        {
            type: String,
            required: true,
        }
        ,
        hospital_id: {
            type: Schema.Types.ObjectId,
            ref: "Hospital",
            required: true,
        },
    }, modelOptions)
)