const express = require("express");
const authRoutes = require("./routes/auth");
const articleRoutes = require("./routes/articleRoutes");
const systemRoutes = require("./routes/systemRoutes");
const reportRoutes = require("./routes/reportRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/articles", articleRoutes);
router.use("/system", systemRoutes);
router.use("/reports", reportRoutes);

module.exports = router;
