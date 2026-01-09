const express = require("express");
const protected = require("../middleware/auth");
const {
  updateTutorProfile,
  getTutorProfile,
  getTutorProfileByUsername,
  getAllTutors,
} = require("../controllers/mainController");

const router = express.Router();

router.put("/tutor/profile", protected, updateTutorProfile);
router.get("/tutor/profile", protected, getTutorProfile);
router.get("/tutors", getAllTutors);

// Get tutor profile by username (public)
router.get("/tutor/profile/:username", getTutorProfileByUsername);
module.exports = router;
