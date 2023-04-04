import express from "express";
import { body } from "express-validator";
import condiRuleController from "../controllers/condi_rule.controller.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });
router.post(
  "/add_condi_rule",
  body("condi_name").notEmpty().withMessage("name is required"),
  body("ruleId").notEmpty().withMessage("ruleId is required"),
  condiRuleController.addCondiRule
);

export default router;
