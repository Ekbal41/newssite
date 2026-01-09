const express = require("express");
const verifyC = require("../controllers/verificationController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/email", verifyC.emailVerification);
router.get(
  "/email/send-verification-link",
  auth,
  verifyC.sendEmailVerificationLink
);

module.exports = router;
