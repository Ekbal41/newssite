const { prisma } = require("../config/prisma");

exports.getHealth = async (req, res) => {
  /* #swagger.tags = ['System']*/
  res.status(200).json({
    status: "ok",
    database: "connected",
  });
};
exports.getSystemInfo = (req, res) => {
  /* #swagger.tags = ['System']*/
  res.status(200).json({
    status: "success",
    data: {
      appName: process.env.PROJECT_NAME || "PERN App",
      version: process.env.PROJECT_VERSION || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    },
  });
};

exports.getApiVersion = (req, res) => {
  /* #swagger.tags = ['System']*/
  res.status(200).json({
    status: "success",
    data: {
      apiVersion: process.env.API_VERSION || "1.0.0",
      minimumClientVersion: "1.0.0", // Useful for mobile apps
      changelog: `${process.env.APP_URL}/changelog`,
      documentation: `${process.env.APP_URL}/docs`,
      build: {
        number: process.env.BUILD_NUMBER || "local",
        timestamp: process.env.BUILD_TIMESTAMP || new Date().toISOString(),
        commit: process.env.COMMIT_HASH || "dev",
      },
      status: "active", // or 'maintenance' during downtime
      deprecationDate: null, // or ISO date if version will be deprecated
    },
  });
};
