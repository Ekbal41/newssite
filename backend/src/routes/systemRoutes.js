const express = require("express");
const auditController = require("../controllers/auditController");
const notiController = require("../controllers/notificationController");
const auth = require("../middleware/auth");

const router = express.Router();

router.use(auth.protect);

router.get("/logs", auth.restrictTo("ADMIN"), auditController.getLogs);
router.get("/notifications", notiController.getNotifications);
router.patch("/:notificationId/read", notiController.markAsRead);
router.post("/notifications/read-all", notiController.markAllAsRead);

module.exports = router;
