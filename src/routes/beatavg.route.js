import express from "express";
import { body } from "express-validator";
import beatavgController from "../controllers/beatavg.controller.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });
//router.get("/check", espController.check)
router.post(
  "/add_beat_avg",
  body("mac")
    .exists()
    .withMessage("Mac is required")
    .isLength({ min: 16 })
    .withMessage("Mac minimum 16 chracter"),
  body("avg").exists().withMessage("avg is required"),
  body("patient_cccd").exists().withMessage("patient_cccd is required"),
  requestHandler.validate,
  beatavgController.addBeatAvg
);

export default router;
