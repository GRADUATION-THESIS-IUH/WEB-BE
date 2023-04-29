import express from "express";
import { body } from "express-validator";
import media_recordController from "../controllers/media_record.controller.js";
import requestHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router({ mergeParams: true });
router.post(
  "/add_media_record",
  tokenMiddleware.auth,
  media_recordController.addMediaRecord
);

router.post("/get_media_record",tokenMiddleware.auth, media_recordController.getMediaRecord);

router.post("/predictor",tokenMiddleware.auth, media_recordController.predictorMediaRecord);

router.post("/end_media_record", tokenMiddleware.auth, media_recordController.endMediaRecord);

export default router;


