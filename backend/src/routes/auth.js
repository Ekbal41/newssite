const express = require("express");
const authC = require("../controllers/authController");
const v = require("../middleware/validate");
const authVal = require("../validations/authValidation");
const protected = require("../middleware/auth");

const router = express.Router();

router.post("/register", v(authVal.register), authC.register);
router.post("/login", v(authVal.login), authC.login);
router.post("/logout", protected.protect, authC.logout);
router.get("/me", protected.protect, authC.getMe);
router.post("/change-password", protected.protect, authC.changePassword);
router.post("/reset-password", authC.resetPassword);
router.post("/send-password-reset-link", authC.sendPassResetLinkEmail);

// Admin only routes
router.get("/users", protected.protect, protected.restrictTo("ADMIN"), authC.getAllUsers);
router.patch("/users/role", protected.protect, protected.restrictTo("ADMIN"), authC.updateUserRole);

module.exports = router;
