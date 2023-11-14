const express = require("express");

const {createUser,loginUser,handlerRefreshToken,logout,updatePassword,loginAdmin,forgotPasswordToken,resetPassword} = require("../controller/authController");
const { authMiddleware, isAdmin} = require("../middlewares/authmiddleware");

const router = express.Router();


// Auth Router
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/login-admin", loginAdmin);
router.put("/update-password",  authMiddleware,updatePassword);
router.get("/refreshToken", handlerRefreshToken );
router.get("/logout", logout );
router.post("/forgot-password", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);











module.exports = router;