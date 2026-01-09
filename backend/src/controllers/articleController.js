const prisma = require("../config/prisma");
const AppError = require("../utils/appError");
const auditController = require("./auditController");

exports.createArticle = async (req, res, next) => {
  try {
    const { headline, body, category, location, sources, evidence } = req.body;

    const article = await prisma.article.create({
      data: {
        headline,
        body,
        category,
        location,
        authorId: req.user.id,
        status: "PENDING_VERIFICATION", // Auto-submit for verification
        sources: {
          create: sources.map(s => ({
            name: s.name,
            url: s.url,
            description: s.description
          }))
        },
        evidence: {
          create: evidence.map(e => ({
            type: e.type,
            url: e.url,
            description: e.description
          }))
        }
      },
      include: {
        sources: true,
        evidence: true
      }
    });

    await auditController.logAction(req.user.id, "CREATE_ARTICLE", { articleId: article.id, headline });

    // Notify Fact Checkers
    const { addNotification } = require("./notificationController");
    await addNotification({
      type: "system",
      event: "NEW_ARTICLE_SUBMITTED",
      message: `New article submitted: ${headline}`,
      payload: { articleId: article.id }
    });

    res.status(201).json({
      status: "success",
      article
    });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = { status: "PUBLISHED" };
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { headline: { contains: search } },
        { body: { contains: search } }
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: Number(limit),
        include: {
          author: { select: { name: true } },
          corrections: { orderBy: { createdAt: 'desc' }, take: 1 }
        }
      }),
      prisma.article.count({ where })
    ]);

    res.status(200).json({
      status: "success",
      articles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getArticle = async (req, res, next) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: req.params.id },
      include: {
        author: { select: { name: true } },
        sources: true,
        evidence: true,
        corrections: { orderBy: { createdAt: 'desc' } },
        reviews: {
          include: { reviewer: { select: { name: true, role: true } } }
        }
      }
    });

    if (!article) return next(AppError.notFound("Article not found"));

    res.status(200).json({
      status: "success",
      article
    });
  } catch (err) {
    next(err);
  }
};

exports.reviewArticle = async (req, res, next) => {
  try {
    const { status, comment } = req.body;
    const articleId = req.params.id;
    const reviewerRole = req.user.role;

    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article) return next(AppError.notFound("Article not found"));

    let nextStatus = article.status;
    let reviewType = "";

    if (reviewerRole === "FACT_CHECKER") {
      reviewType = "FACT_CHECK";
      if (status === "APPROVED") nextStatus = "PENDING_EDITORIAL";
      else if (status === "REJECTED") nextStatus = "REJECTED";
    } else if (reviewerRole === "EDITOR") {
      reviewType = "EDITORIAL";
      if (status === "APPROVED") {
        nextStatus = "PUBLISHED";
        // Set publishedAt if it's the first time
        await prisma.article.update({
          where: { id: articleId },
          data: { publishedAt: new Date() }
        });
      }
      else if (status === "REJECTED") nextStatus = "REJECTED";
    }

    const review = await prisma.review.create({
      data: {
        articleId,
        reviewerId: req.user.id,
        type: reviewType,
        status,
        comment
      }
    });

    await prisma.article.update({
      where: { id: articleId },
      data: { status: nextStatus }
    });

    const { addNotification } = require("./notificationController");
    
    // Notify Journalist
    await addNotification({
      type: "user",
      targetId: article.authorId,
      identifier: article.authorId,
      event: "ARTICLE_REVIEWED",
      message: `Your article "${article.headline}" has been ${status.toLowerCase()}.`,
      payload: { articleId, status, nextStatus }
    });

    // If approved by Fact Checker, notify Editors
    if (reviewerRole === "FACT_CHECKER" && status === "APPROVED") {
      await addNotification({
        type: "system",
        event: "ARTICLE_VERIFIED",
        message: `Article verified and pending editorial review: ${article.headline}`,
        payload: { articleId }
      });
    }

    await auditController.logAction(req.user.id, "REVIEW_ARTICLE", { articleId, status, nextStatus });

    res.status(200).json({
      status: "success",
      review,
      articleStatus: nextStatus
    });
  } catch (err) {
    next(err);
  }
};

exports.addCorrection = async (req, res, next) => {
  try {
    const { reason, newHeadline, newBody } = req.body;
    const articleId = req.params.id;

    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article) return next(AppError.notFound("Article not found"));

    const correction = await prisma.correction.create({
      data: {
        articleId,
        editorId: req.user.id,
        oldHeadline: article.headline,
        oldBody: article.body,
        reason
      }
    });

    await prisma.article.update({
      where: { id: articleId },
      data: {
        headline: newHeadline || article.headline,
        body: newBody || article.body
      }
    });

    await auditController.logAction(req.user.id, "ADD_CORRECTION", { articleId, correctionId: correction.id });

    res.status(200).json({
      status: "success",
      correction
    });
  } catch (err) {
    next(err);
  }
};

exports.getPendingArticles = async (req, res, next) => {
  try {
    const role = req.user.role;
    const { search, category, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let statusFilter = {};

    if (role === "FACT_CHECKER") statusFilter = { status: "PENDING_VERIFICATION" };
    else if (role === "EDITOR") statusFilter = { status: "PENDING_EDITORIAL" };
    else if (role === "ADMIN") {
      statusFilter = { status: { in: ["PENDING_VERIFICATION", "PENDING_EDITORIAL"] } };
    }

    const where = { ...statusFilter };
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { headline: { contains: search } },
        { body: { contains: search } }
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
        include: { author: { select: { name: true } }, sources: true }
      }),
      prisma.article.count({ where })
    ]);

    res.status(200).json({
      status: "success",
      articles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyArticles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: { authorId: req.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
        include: {
          sources: true,
          evidence: true,
          corrections: true
        }
      }),
      prisma.article.count({ where: { authorId: req.user.id } })
    ]);

    res.status(200).json({
      status: "success",
      articles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    next(err);
  }
};
