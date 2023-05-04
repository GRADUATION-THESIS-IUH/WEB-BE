import express from "express";
import { body } from "express-validator";
import patientController from "../controllers/patient.controller.js";
import requestHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router({ mergeParams: true });
router.post(
  "/add_patient",
  tokenMiddleware.auth,
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
    .isBoolean()
    .withMessage("status must be a boolean value"),
  requestHandler.validate,
  patientController.addPatient
);

router.get("/get_all", tokenMiddleware.auth, patientController.getPatient);

router.get(
  "/get_inactive",
  tokenMiddleware.auth,
  patientController.getInactivePatient
);

router.get(
  "/get_patient_top_hb",
  tokenMiddleware.auth,
  patientController.getPatientTopHB
);

router.post(
  "/get_patient_by_id",
  tokenMiddleware.auth,
  patientController.getPatientById
);

router.post(
  "/update_patient_status",
  tokenMiddleware.auth,
  patientController.updatePatientStatus
);

router.put("/update_patient", tokenMiddleware.auth, patientController.updatePatient);

router.post("/delete_patient", tokenMiddleware.auth, patientController.deletePatient)

export default router;
