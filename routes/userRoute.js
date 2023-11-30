const express = require("express");

const {createUser,loginUser,handlerRefreshToken,logout,updatePassword,loginAdmin,forgotPasswordToken,resetPassword} = require("../controller/authController");
const { authMiddleware, isAdmin} = require("../middlewares/authmiddleware");

const {getallUser,getaUser,deleteaUser,updateUser,getWishlist,saveAddress} = require("../controller/userController");

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


router.get("/all-users", getallUser);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/userid/:id", authMiddleware,  getaUser);
router.delete("/delete/:id", authMiddleware, deleteaUser);
router.put("/update",  authMiddleware,updateUser);
router.put("/save-address",  authMiddleware,saveAddress);











module.exports = router;