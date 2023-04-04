import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
    "ConditionRule",
    mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        ruleId:{
            type: Schema.Types.ObjectId,
            ref: "Rule",
            required: true,
        }
    }, modelOptions)
)