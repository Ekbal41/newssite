const prisma = require("../config/prisma");
const AppError = require("../utils/appError");

exports.createReport = async (req, res, next) => {
  try {
    const { articleId, reason, details } = req.body;

    const report = await prisma.report.create({
      data: {
        articleId,
        reporterId: req.user.id,
        reason,
        details
      }
    });

    res.status(201).json({
      status: "success",
      report
    });
  } catch (err) {
    next(err);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const reports = await prisma.report.findMany({
      where: { status: "PENDING" },
      include: {
        article: { select: { headline: true } },
        reporter: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json({
      status: "success",
      reports
    });
  } catch (err) {
    next(err);
  }
};

exports.resolveReport = async (req, res, next) => {
  try {
    const { status } = req.body;
    const reportId = req.params.id;

    const report = await prisma.report.update({
      where: { id: reportId },
      data: { status }
    });

    res.status(200).json({
      status: "success",
      report
    });
  } catch (err) {
    next(err);
  }
};
