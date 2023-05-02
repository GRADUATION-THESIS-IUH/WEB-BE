import express from "express";
import tokenMiddleware from "../middlewares/token.middleware.js";
import statisticController from "../controllers/statistic.controller.js";

const router = express.Router({ mergeParams: true });
router.post("/getStatistic", tokenMiddleware.auth, statisticController.getStatisticYear);
export default router;