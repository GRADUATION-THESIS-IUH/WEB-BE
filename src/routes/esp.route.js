import express from "express";
import { body } from "express-validator";
import espController from "../controllers/esp.controller.js";
import requestHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router({ mergeParams: true });
router.post(
  "/add_hb",
  tokenMiddleware.auth,
  espController.addHearthBeat
);

router.get("/get_hb",tokenMiddleware.auth, espController.getHearthBeatAll);
router.post("/get_hb_from_ip_mac",tokenMiddleware.auth, espController.getHearthBeatFromIpMac);
router.post("/get_hb_cbb",tokenMiddleware.auth, espController.getHearthBeatAllCBB);
router.post("/update_hb_status",tokenMiddleware.auth, espController.updateHearthBeatStatus);
router.post("/update_hb_patient_cccd",tokenMiddleware.auth, espController.updateHearthBeatPatientCCCD);
router.post("/update_hb", tokenMiddleware.auth, espController.updateHearthBeat);
router.post("/delete_hb", tokenMiddleware.auth, espController.deleteHearthBeat);

export default router;
