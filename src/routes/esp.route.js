import express from "express";
import { body } from "express-validator";
import espController from "../controllers/esp.controller.js";
import requestHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router({ mergeParams: true });
router.post(
  "/add_IOT",
  tokenMiddleware.auth,
  body("mac")
    .exists()
    .withMessage("Mac is required")
    .isLength({ min: 16 })
    .withMessage("Mac minimum 16 chracter"),
  body("hospital_id").exists().withMessage("Hospital_id is required"),
  requestHandler.validate,
  espController.addHearthBeat
);

router.put(
  "/update_IOT",
  body("ip_mac")
    .exists()
    .withMessage("Mac is required")
    .isLength({ min: 16 })
    .withMessage("Mac minimum 16 chracter"),
  body("patient_cccd").exists().withMessage("patient_cccd is required"),
  requestHandler.validate,
  espController.updateHearthBeat
)

router.get("/get_hb",tokenMiddleware.auth, espController.getHearthBeatAll);
router.post("/get_hb_cbb",tokenMiddleware.auth, espController.getHearthBeatAllCBB);
router.post("/update_hb_status",tokenMiddleware.auth, espController.updateHearthBeatStatus);
export default router;
