import express from "express";
import { body } from "express-validator";
import ruleController from "../controllers/rule.controller.js";
import requestHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router({ mergeParams: true });
router.post(
  "/add_rule",
  tokenMiddleware.auth,
    body("name").notEmpty().withMessage("name is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("rules").notEmpty().withMessage("rules is required").isObject().withMessage("rules must be an object"),
  ruleController.addRule
);

export default router;
