import express from "express";
import { body } from "express-validator";
import hospitalController from "../controllers/hospital.controller.js";
import requestHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router({ mergeParams: true });
router.post(
  "/add_hospital",
  tokenMiddleware.auth,
  body("name")
    .exists()
    .withMessage("name is required")
    .isLength({ min: 5 })
    .withMessage("name minimum 5 chracter"),
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

router.get("/get_all_cbb", tokenMiddleware.auth, hospitalController.getAllHospitalCBB)

router.get("/get_all", tokenMiddleware.auth, hospitalController.getAllHospital);

router.get("/get_all_top_5_device", tokenMiddleware.auth, hospitalController.getAllHospitalTop5Device);

router.post("/update_hospital", tokenMiddleware.auth, hospitalController.updateHospital);

router.post("/delete_hospital", tokenMiddleware.auth, hospitalController.deleteHospital)

export default router;
