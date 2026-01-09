const prisma = require("../config/prisma");

exports.logAction = async (userId, action, details) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details: JSON.stringify(details)
      }
    });
  } catch (err) {
    console.error("Failed to log action:", err);
  }
};

exports.getLogs = async (req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, role: true } } },
      take: 100
    });

    res.status(200).json({
      status: "success",
      logs
    });
  } catch (err) {
    next(err);
  }
};
