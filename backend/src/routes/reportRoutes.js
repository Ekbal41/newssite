const express = require("express");
const reportController = require("../controllers/reportController");
const auth = require("../middleware/auth");

const router = express.Router();

router.use(auth.protect);

router.post("/", reportController.createReport);
router.get("/", auth.restrictTo("EDITOR", "ADMIN"), reportController.getReports);
router.patch("/:id", auth.restrictTo("EDITOR", "ADMIN"), reportController.resolveReport);

module.exports = router;
