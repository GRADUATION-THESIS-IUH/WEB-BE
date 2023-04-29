import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
    "Rule",
    mongoose.Schema({
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      heartRateFrom: {
        type: Number,
        required: true,
      },
      heartRateTo: {
        type: Number,
        required: true,
      },
    }, modelOptions));
        