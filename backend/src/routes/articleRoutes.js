const express = require("express");
const articleController = require("../controllers/articleController");
const auth = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", articleController.getArticles);

// Protected routes
router.use(auth.protect);

router.get("/my-articles", articleController.getMyArticles);
router.get("/pending/verification", auth.restrictTo("FACT_CHECKER", "EDITOR", "ADMIN"), articleController.getPendingArticles);
router.post("/", auth.restrictTo("JOURNALIST", "ADMIN"), articleController.createArticle);
router.post("/:id/review", auth.restrictTo("FACT_CHECKER", "EDITOR", "ADMIN"), articleController.reviewArticle);
router.post("/:id/correction", auth.restrictTo("EDITOR", "ADMIN"), articleController.addCorrection);

// Generic ID route should be last
router.get("/:id", articleController.getArticle);

module.exports = router;
