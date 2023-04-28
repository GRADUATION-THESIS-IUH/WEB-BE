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

export default router;
