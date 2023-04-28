import express from "express";
import { body } from "express-validator";
import doctorController from "../controllers/doctor.controller.js";
import requestHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router({ mergeParams: true });
//router.get("/check", espController.check)
router.post(
  "/add_doctor",
  tokenMiddleware.auth,
  body("name")
    .exists()
    .withMessage("Doctor is required")
    .isLength({ min: 8 })
    .withMessage("Doctor minimum 8 chracter"),
  body("phone")
    .exists()
    .withMessage("Phone is required")
    .isLength({ min: 8 })
    .withMessage("Phone minimum 8 chracter"),
  body("specialist")
    .exists()
    .withMessage("Specialist is required")
    .isLength({ min: 2 })
    .withMessage("Mac minimum 2 chracter"),
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),
  body("hospitalName")
    .exists()
    .withMessage("Hospital Name is required")
    .isLength({ min: 8 })
    .withMessage("Mac minimum 8 chracter"),
  requestHandler.validate,
  doctorController.addDoctor
);

router.get("/get_doctor", tokenMiddleware.auth, doctorController.getDoctor);
router.get("/get_all_doctor", tokenMiddleware.auth, doctorController.getAllDoctor);
router.get("/get_all_doctor_cbb", tokenMiddleware.auth, doctorController.getAllDoctorCBB);

export default router;
