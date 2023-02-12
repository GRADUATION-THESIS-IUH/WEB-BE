import express from "express"
import { body } from "express-validator"
import reviewController from "../controllers/review.Controller.js"
import tokenMiddleware from "../middlewares/token.middleware.js"
import requestHandler from "../handlers/request.handler.js"

const router = express.Router({ mergeParams: true })

router.get(
    "/",
    tokenMiddleware.auth,
    reviewController.getReviewsOfUser
)

router.post(
    "/",
    tokenMiddleware.auth,
    body("mediaId")
        .exists().withMessage("mediaId is required")
        .isLength({ min: 1 }).withMessage("mediaId can not be empty"),
    body("content")
        .exists().withMessage("conten is required")
        .isLength({ min: 1 }).withMessage("content can not be empty"),
    body("mediatype")
        .exists().withMessage("mediatype is required")
        .custom(type => ["movie", "tv"].includes(type)).withMessage("mediatype invalid"),
    body("mediaTitle")
        .exists().withMessage("mediaTitle is required"),
    body("mediaPoster")
        .exists().withMessage("mediaPoster is required"),
    requestHandler.validate,
    reviewController.create
)

router.delete(
    "/:reviewId",
    tokenMiddleware.auth,
    reviewController.remove
)

export default router