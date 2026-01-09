const prisma = require("../config/prisma");
const { emitToUser, broadcast } = require("../config/socket");

exports.addNotification = async ({
  type,
  targetId,
  identifier,
  message,
  payload,
  event,
  emit = true,
}) => {
  /* #swagger.tags = ['Notification']*/
  const notification = await prisma.notification.create({
    data: { 
      type, 
      targetId, 
      identifier, 
      event, 
      message, 
      payload: payload && typeof payload === 'object' ? JSON.stringify(payload) : payload 
    },
  });
  if (emit) {
    switch (type) {
      case "user":
        if (targetId) emitToUser(targetId, `notification`, notification);
        break;
      case "system":
        broadcast("notification", notification);
        break;
    }
  }
  return notification;
};

exports.getNotifications = async (req, res) => {
  /* #swagger.tags = ['Notification']*/
  try {
    let { types, page = 1, limit = 4 } = req.query;
    const userId = req.user?.id;
    const skip = (Number(page) - 1) * Number(limit);

    if (!types) {
      return res
        .status(400)
        .json({ error: "At least one type is required (user, system)" });
    }

    // Handle if types is already an array (some clients might send it that way)
    const typeArray = Array.isArray(types) 
      ? types.map(t => t.trim().toLowerCase())
      : types.split(",").map((t) => t.trim().toLowerCase());
    if (!typeArray.length) {
      return res
        .status(400)
        .json({ error: "At least one type is required (user, system)" });
    }

    const conditions = [];
    if (typeArray.includes("user")) {
      conditions.push({ type: "user", identifier: userId });
    }

    if (typeArray.includes("system")) {
      conditions.push({ type: "system" });
    }

    const where = { OR: conditions };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { ...where, read: false } }),
    ]);

    const unreadBreakdown = {};
    for (const type of typeArray) {
      let condition;
      if (type === "user") condition = { type: "user", identifier: userId };
      if (type === "system") condition = { type: "system" };

      unreadBreakdown[type] = await prisma.notification.count({
        where: { ...condition, read: false },
      });
    }

    res.json({
      notifications,
      unreadCount,
      unreadBreakdown,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  /* #swagger.tags = ['Notification']*/
  try {
    const { notificationId } = req.params;

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  /* #swagger.tags = ['Notification']*/
  try {
    const { types } = req.body;
    const userId = req.user?.id;

    const typeArray = types ? types.split(",").map((t) => t.trim()) : [];
    if (!typeArray.length) {
      return res
        .status(400)
        .json({ error: "At least one type is required (user, system)" });
    }

    const conditions = [];
    if (typeArray.includes("user"))
      conditions.push({ type: "user", identifier: userId });

    if (typeArray.includes("system")) conditions.push({ type: "system" });
    const where = { OR: conditions, read: false };
    const result = await prisma.notification.updateMany({
      where,
      data: { read: true },
    });

    const unreadBreakdown = {};
    for (const type of typeArray) {
      let condition;
      if (type === "user") condition = { type: "user", identifier: userId };
      if (type === "system") condition = { type: "system" };

      unreadBreakdown[type] = await prisma.notification.count({
        where: { ...condition, read: false },
      });
    }
    res.json({
      message: "Selected notifications marked as read.",
      updatedCount: result.count,
      unreadBreakdown,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
