import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
  "BeatAvg",
  mongoose.Schema(
    {
      date_received: {
        type: Date,
        required: true,
      },
      ip_mac: {
        type: String,
        required: true,
      },
      avg: {
        type: String,
        required: true,
      },
      patient_cccd: {
        type: String,
        required: true,
      },
    },
    modelOptions
  )
);
