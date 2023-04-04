import express from "express";
import { body } from "express-validator";
import dashboardController from "../controllers/dashboard.controller.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });
router.get(
  "/get_db_card",
  dashboardController.getDashBoardCard
);

export default router;
