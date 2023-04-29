import express from "express";
import { body } from "express-validator";
import ruleController from "../controllers/rule.controller.js";
import requestHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router({ mergeParams: true });
router.post(
  "/update_rule",
  tokenMiddleware.auth,
  ruleController.updateRule
);
router.post("/addRule", tokenMiddleware.auth, ruleController.addRule);

router.get("/getRule", tokenMiddleware.auth, ruleController.getRule);
export default router;
