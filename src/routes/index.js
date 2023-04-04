import express from "express"
import userRoute from "./user.route.js"
import mediaRoute from "./media.route.js"
import personRoute from "./person.route.js"
import reviewRoute from "./review.route.js"
import espRoute from "./esp.route.js"
import patientRoute from "./patient.route.js"
import hospitalRoute from "./hospital.route.js"
import beatAvgRoute from "./beatavg.route.js"
import warningRoute from "./warning.route.js"
import doctorRoute from "./doctor.route.js"
import dashboard from "./dashboard.route.js"
import condiRule from "./condi_rule.route.js"
import rule from "./rule.route.js"

const router = express.Router()

router.use("/user", userRoute)
router.use("/dashboard", dashboard)
router.use("/esp", espRoute)
router.use("/patient", patientRoute)
router.use("/doctor", doctorRoute)
router.use("/beat_avg", beatAvgRoute)
router.use("/hospital", hospitalRoute)
router.use("/warning", warningRoute)
router.use("/reviews", reviewRoute)
router.use("/rule", rule)
router.use("/condi_rule", condiRule)
router.use("/:mediaType", mediaRoute)

export default router;