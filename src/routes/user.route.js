import express from "express"
import { body } from "express-validator"
import favoriteController from "../controllers/favorite.controller.js"
import userController from "../controllers/user.controller.js"
import requestHander from "../handlers/request.handler.js"
import userModel from "../models/user.model.js"
import tokenMiddleware from "../middlewares/token.middleware.js"

const router = express.Router()

router.post(
    "/signup",
    body("username")
        .exists().withMessage("username is required")
        .isLength({ min: 8 }).withMessage("username minimum 8 characters")
        .custom(async value => {
            const user = await userModel.findOne({ username: value })
            if (user) return Promise.reject("username already used")
        }),
    body("password")
        .exists().withMessage("password is required")
        .isLength({ min: 8 }).withMessage("password minimum 8 characters"),
    body("confirmPassword")
        .exists().withMessage("confirmPassword is required")
        .isLength({ min: 8 }).withMessage("Confirm Password minimum 8 characters")
        .custom((value, { req }) => {
            if (value !== req.body.password) throw new Error("Confirm Password is not match")
            return true
        }),
    body("displayName")
        .exists().withMessage("displayName is required")
        .isLength({ min: 8 }).withMessage("Displayname minimum 8 characters"),
    requestHander.validate,
    userController.signup
)

router.post(
    "/signin",
    body("username")
        .exists().withMessage("username is required")
        .isLength({ min: 8 }).withMessage("username minimum 8 characters"),
    body("password")
        .exists().withMessage("password is required")
        .isLength({ min: 8 }).withMessage("username minimum 8 characters"),
    requestHander.validate,
    userController.signin
)

router.put(
    "/update-password",
    tokenMiddleware.auth,
    body("password")
        .exists().withMessage("password is required")
        .isLength({ min: 8 }).withMessage("username minimum 8 characters"),
    body("newPassword")
        .exists().withMessage("password is required")
        .isLength({ min: 8 }).withMessage("newPassword minimum 8 characters"),
    body("comfirmNewPassword")
        .exists().withMessage("password is required")
        .isLength({ min: 8 }).withMessage("comfirmNewPassword minimum 8 characters")
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) throw new Error("comfirmNewPassword Password is not match")
            return true
        }),
    requestHander.validate,
    userController.updatePassword

)

router.get(
    "/info",
    tokenMiddleware.auth,
    userController.getInfo
)

router.get(
    "/favorites",
    tokenMiddleware.auth,
    favoriteController.getFavoritesOfUser
)

router.post(
    "/favorites",
    tokenMiddleware.auth,
    body("mediatype")
        .exists().withMessage("mediatype is required")
        .custom(type => ["movie", "tv"].includes(type)).withMessage("mediatype invalid"),
    body("mediaId")
        .exists().withMessage("mediaId is required")
        .isLength({ min: 1 }).withMessage("mediaId can not be empty"),
    body("mediaTitle")
        .exists().withMessage("mediaTitle is required"),
    body("mediaPoster")
        .exists().withMessage("mediaPoster is required"),
    favoriteController.addFavorite
)

router.delete(
    "/favorite/:favoriteId",
    tokenMiddleware.auth,
    favoriteController.removeFavorite
)

export default router