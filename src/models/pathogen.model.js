import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(  
    "Pathogen",
    mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
            required: true,
        },
    }, modelOptions)
)