import express from "express";
import { body } from "express-validator";
import dashboardController from "../controllers/dashboard.controller.js";
import requestHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router({ mergeParams: true });
router.get(
  "/get_db_card",
  tokenMiddleware.auth,
  dashboardController.getDashBoardCard
);

router.post(
  "/get_heart_rate_chart_week",
  tokenMiddleware.auth,
  dashboardController.getDashBoardChartWeek
);

export default router;
