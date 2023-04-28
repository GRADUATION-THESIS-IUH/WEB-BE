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
      patient_cccd: {
        type: String,
        required: true,
      },
      metric: {
        type: String,
        required: true,
      },
      ip_mac: {
        type: String,
        required: true,
      },
      measurements: {
        type: [
          {
            type: {
              hour: Number,
              minute: Number,
            },
          },
        ],
        default: () => {
          const measurements = [];
          for (let i = 0; i < 24; i++) {
            const hour = i;
            const hourData = {};
            for (let j = 0; j < 60; j++) {
              hourData[j] = [0];
            }
            measurements.push({ hour: hour, ...hourData });
          }
          return measurements;
        },
      },
    },
    modelOptions
  )
);
