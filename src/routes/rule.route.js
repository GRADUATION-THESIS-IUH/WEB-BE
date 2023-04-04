import express from "express";
import { body } from "express-validator";
import ruleController from "../controllers/rule.controller.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });
router.post(
  "/add_rule",
    body("name").notEmpty().withMessage("name is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("rules").notEmpty().withMessage("rules is required").isObject().withMessage("rules must be an object"),
  ruleController.addRule
);

export default router;
