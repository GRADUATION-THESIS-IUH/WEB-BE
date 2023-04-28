import express from "express";
import { body } from "express-validator";
import beatavgController from "../controllers/beatavg.controller.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });
//router.get("/check", espController.check)
router.post(
  "/add_beat_avg",
  body("patient_cccd").exists().withMessage("patient_cccd is required"),
  body("metric").exists().withMessage("metric is required"),
  body("ip_mac").exists().withMessage("ip_mac is required"),
  body("measurements").exists().withMessage("measurements is required"),
  requestHandler.validate,
  beatavgController.addBeatAvg
);

export default router;
