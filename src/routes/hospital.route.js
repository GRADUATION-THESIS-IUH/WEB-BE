import express from "express";
import { body } from "express-validator";
import hospitalController from "../controllers/hospital.controller.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });
router.post(
  "/add_hospital",
  body("name")
    .exists()
    .withMessage("name is required")
    .isLength({ min: 5 })
    .withMessage("name minimum 8 chracter"),
  body("address")
    .exists()
    .withMessage("address is required")
    .isLength({ min: 8 })
    .withMessage("address minimum 8 chracter"),
  body("phone")
    .exists()
    .withMessage("phone is required")
    .isLength({ min: 6 })
    .withMessage("phone minimum 6 chracter"),
  requestHandler.validate,
  hospitalController.addHospital
);

export default router;
