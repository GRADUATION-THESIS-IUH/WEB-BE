import express from "express";
import { body } from "express-validator";
import warningController from "../controllers/warning.controller.js";
import requestHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router({ mergeParams: true });
router.post(
  "/add_warning",
  body("warning")
    .exists()
    .withMessage("warning is required"),
    body("ip_mac")
    .exists()
    .withMessage("ip_mac is required"),
  body("date")
    .exists()
    .withMessage("date is required")
    .isDate()
    .withMessage("date is not valid"),
  requestHandler.validate,
  warningController.addWarning
);

router.get("/get_warning",tokenMiddleware.auth, warningController.getWarning);

export default router;
