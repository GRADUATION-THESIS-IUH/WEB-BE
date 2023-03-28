import express from "express";
import { body } from "express-validator";
import patientController from "../controllers/patient.controller.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });
router.post(
  "/add_patient",
  body("name")
    .exists()
    .withMessage("name is required")
    .isLength({ min: 8 })
    .withMessage("name minimum 8 chracter"),
  body("age")
    .exists()
    .withMessage("age is required")
    .isLength({ min: 1 })
    .withMessage("age minimum 1 chracter"),
  body("phone")
    .exists()
    .withMessage("phone is required")
    .isLength({ min: 10 })
    .withMessage("phone minimum 10 chracter"),
  body("CCCD")
    .exists()
    .withMessage("CCCD is required")
    .isLength({ min: 12 })
    .withMessage("CCCD minimum 12 chracter"),
  body("hospital_id")
    .exists()
    .withMessage("hospital_id is required")
    .isLength({ min: 8 })
    .withMessage("hospital_id minimum 8 chracter"),
    body("status")
    .exists()
    .withMessage("status is required")
    .isBoolean().withMessage("status must be a boolean value"),
  requestHandler.validate,
  patientController.addPatient
);

export default router;