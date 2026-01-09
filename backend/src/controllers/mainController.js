const prisma = require("../config/prisma");

exports.updateTutorProfile = async (req, res) => {
  /* #swagger.tags = ['Tutor'] */
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      username,
      headline,
      bio,
      profilePhoto,
      coverPhoto,
      gender,
      dateOfBirth,
      highestEducation,
      institution,
      department,
      currentStatus,
      subjects,
      classes,
      medium,
      curriculum,
      experienceYears,
      tuitionType,
      preferredGender,
      expectedSalary,
      availableDays,
      availableTime,
      willingToTravel,
      city,
      area,
      isAvailable,
      isActive,
    } = req.body;

    // Filter out undefined values - FIXED
    const data = Object.fromEntries(
      Object.entries({
        username,
        headline,
        bio,
        profilePhoto,
        coverPhoto,
        gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        highestEducation,
        institution,
        department,
        currentStatus,
        subjects,
        classes,
        medium,
        curriculum,
        experienceYears,
        tuitionType,
        preferredGender,
        expectedSalary,
        availableDays,
        availableTime,
        willingToTravel,
        city,
        area,
        isAvailable,
        isActive,
      }).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for update",
      });
    }

    // Check if tutor profile exists, if not create it
    const existingTutor = await prisma.tutor.findUnique({
      where: { userId },
    });

    let tutor;

    if (!existingTutor) {
      // Create new tutor profile
      tutor = await prisma.tutor.create({
        data: {
          userId,
          ...data,
        },
        select: {
          id: true,
          username: true,
          headline: true,
          bio: true,
          city: true,
          area: true,
          subjects: true,
          classes: true,
          tuitionType: true,
          expectedSalary: true,
          isAvailable: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else {
      // Update existing tutor profile
      tutor = await prisma.tutor.update({
        where: { userId },
        data,
        select: {
          id: true,
          username: true,
          headline: true,
          bio: true,
          city: true,
          area: true,
          subjects: true,
          classes: true,
          tuitionType: true,
          expectedSalary: true,
          isAvailable: true,
          updatedAt: true,
        },
      });
    }

    return res.status(200).json({
      message: existingTutor
        ? "Tutor profile updated successfully"
        : "Tutor profile created successfully",
      tutor,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Username already taken",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Tutor profile not found",
      });
    }

    console.error("Update Tutor Profile Error:", error);
    return res.status(500).json({
      message: "Failed to update tutor profile",
      error: error.message,
    });
  }
};

// GET tutor profile
exports.getTutorProfile = async (req, res) => {
  /* #swagger.tags = ['Tutor'] */
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const tutor = await prisma.tutor.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        username: true,
        headline: true,
        bio: true,
        profilePhoto: true,
        coverPhoto: true,
        gender: true,
        dateOfBirth: true,
        highestEducation: true,
        institution: true,
        department: true,
        currentStatus: true,
        subjects: true,
        classes: true,
        medium: true,
        curriculum: true,
        experienceYears: true,
        tuitionType: true,
        preferredGender: true,
        expectedSalary: true,
        availableDays: true,
        availableTime: true,
        willingToTravel: true,
        city: true,
        area: true,
        isAvailable: true,
        isActive: true,
        isVerified: true,
        identityVerified: true,
        educationVerified: true,
        rating: true,
        totalReviews: true,
        totalStudents: true,
        profileViews: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor profile not found",
      });
    }

    return res.status(200).json({
      message: "Tutor profile retrieved successfully",
      tutor,
    });
  } catch (error) {
    console.error("Get Tutor Profile Error:", error);
    return res.status(500).json({
      message: "Failed to retrieve tutor profile",
      error: error.message,
    });
  }
};

// GET tutor profile by username (public)
exports.getTutorProfileByUsername = async (req, res) => {
  /* #swagger.tags = ['Tutor'] */
  try {
    const { username } = req.params;

    const tutor = await prisma.tutor.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        headline: true,
        bio: true,
        profilePhoto: true,
        coverPhoto: true,
        gender: true,
        highestEducation: true,
        institution: true,
        department: true,
        currentStatus: true,
        subjects: true,
        classes: true,
        medium: true,
        curriculum: true,
        experienceYears: true,
        tuitionType: true,
        expectedSalary: true,
        availableTime: true,
        willingToTravel: true,
        city: true,
        area: true,
        isAvailable: true,
        isVerified: true,
        identityVerified: true,
        educationVerified: true,
        rating: true,
        totalReviews: true,
        totalStudents: true,
        createdAt: true,
      },
    });

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    // Increment profile views
    await prisma.tutor.update({
      where: { username },
      data: {
        profileViews: {
          increment: 1,
        },
      },
    });

    return res.status(200).json({
      message: "Tutor profile retrieved successfully",
      tutor,
    });
  } catch (error) {
    console.error("Get Tutor Profile By Username Error:", error);
    return res.status(500).json({
      message: "Failed to retrieve tutor profile",
      error: error.message,
    });
  }
};

// UPDATE tutor profile
exports.updateTutorProfile = async (req, res) => {
  /* #swagger.tags = ['Tutor'] */
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      username,
      headline,
      bio,
      profilePhoto,
      coverPhoto,
      gender,
      dateOfBirth,
      highestEducation,
      institution,
      department,
      currentStatus,
      subjects,
      classes,
      medium,
      curriculum,
      experienceYears,
      tuitionType,
      preferredGender,
      expectedSalary,
      availableDays,
      availableTime,
      willingToTravel,
      city,
      area,
      isAvailable,
      isActive,
    } = req.body;

    // Filter out undefined values
    const data = Object.fromEntries(
      Object.entries({
        username,
        headline,
        bio,
        profilePhoto,
        coverPhoto,
        gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        highestEducation,
        institution,
        department,
        currentStatus,
        subjects,
        classes,
        medium,
        curriculum,
        experienceYears,
        tuitionType,
        preferredGender,
        expectedSalary,
        availableDays,
        availableTime,
        willingToTravel,
        city,
        area,
        isAvailable,
        isActive,
      }).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for update",
      });
    }

    // Check if tutor profile exists, if not create it
    const existingTutor = await prisma.tutor.findUnique({
      where: { userId },
    });

    let tutor;

    if (!existingTutor) {
      // Create new tutor profile
      tutor = await prisma.tutor.create({
        data: {
          userId,
          ...data,
        },
        select: {
          id: true,
          username: true,
          headline: true,
          bio: true,
          city: true,
          area: true,
          subjects: true,
          classes: true,
          tuitionType: true,
          expectedSalary: true,
          isAvailable: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else {
      // Update existing tutor profile
      tutor = await prisma.tutor.update({
        where: { userId },
        data,
        select: {
          id: true,
          username: true,
          headline: true,
          bio: true,
          city: true,
          area: true,
          subjects: true,
          classes: true,
          tuitionType: true,
          expectedSalary: true,
          isAvailable: true,
          updatedAt: true,
        },
      });
    }

    return res.status(200).json({
      message: existingTutor
        ? "Tutor profile updated successfully"
        : "Tutor profile created successfully",
      tutor,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Username already taken",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Tutor profile not found",
      });
    }

    console.error("Update Tutor Profile Error:", error);
    return res.status(500).json({
      message: "Failed to update tutor profile",
      error: error.message,
    });
  }
};

// GET all tutors with pagination and advanced filters (public endpoint)
exports.getAllTutors = async (req, res) => {
  /* #swagger.tags = ['Tutor'] */
  try {
    const {
      page = 1,
      limit = 10,
      search,
      city,
      area,
      institution,
      department,
      subjects,
      classes,
      tuitionType,
      medium,
      curriculum,
      preferredGender,
      minSalary,
      maxSalary,
      experienceYears,
      isAvailable,
      willingToTravel,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build WHERE conditions
    const where = {
      isActive: true,
    };

    // Text search - Fixed OR condition placement
    if (search && search.trim()) {
      where.OR = [
        { username: { contains: search.trim().toLowerCase() } },
        { headline: { contains: search.trim().toLowerCase() } },
        { bio: { contains: search.trim().toLowerCase() } },
      ];
    }

    // Institution filter
    if (institution && institution.trim()) {
      where.institution = { contains: institution.trim().toLowerCase() };
    }

    // Department filter
    if (department && department.trim()) {
      where.department = { contains: department.trim().toLowerCase() };
    }

    // Availability
    if (isAvailable !== undefined) {
      where.isAvailable = isAvailable === "true" || isAvailable === true;
    }

    // Willing to travel
    if (willingToTravel !== undefined) {
      where.willingToTravel =
        willingToTravel === "true" || willingToTravel === true;
    }

    // Location filters
    if (city) {
      where.city = { equals: city, mode: "insensitive" };
    }

    if (area && area.trim()) {
      where.area = { contains: area, mode: "insensitive" };
    }

    // Tuition type
    if (tuitionType) {
      where.tuitionType = tuitionType;
    }

    // Medium
    if (medium) {
      where.medium = medium;
    }

    // Curriculum
    if (curriculum) {
      where.curriculum = curriculum;
    }

    // Preferred gender
    if (preferredGender) {
      where.preferredGender = Number(preferredGender);
    }

    // Experience years
    if (experienceYears) {
      where.experienceYears = { gte: Number(experienceYears) };
    }

    // Salary range
    if (minSalary || maxSalary) {
      where.expectedSalary = {};
      if (minSalary) {
        where.expectedSalary.gte = Number(minSalary);
      }
      if (maxSalary) {
        where.expectedSalary.lte = Number(maxSalary);
      }
    }

    // Valid sortable fields
    const validSortFields = [
      "rating",
      "totalReviews",
      "profileViews",
      "expectedSalary",
      "experienceYears",
      "createdAt",
    ];

    const orderBy = validSortFields.includes(sortBy)
      ? { [sortBy]: order.toLowerCase() === "asc" ? "asc" : "desc" }
      : { createdAt: "desc" };

    // Execute queries - Fetch all matching tutors first
    let tutors = await prisma.tutor.findMany({
      where,
      orderBy,
      select: {
        id: true,
        username: true,
        headline: true,
        bio: true,
        profilePhoto: true,
        gender: true,
        highestEducation: true,
        institution: true,
        department: true,
        currentStatus: true,
        subjects: true,
        classes: true,
        medium: true,
        curriculum: true,
        experienceYears: true,
        tuitionType: true,
        expectedSalary: true,
        city: true,
        area: true,
        isAvailable: true,
        willingToTravel: true,
        rating: true,
        totalReviews: true,
        totalStudents: true,
        profileViews: true,
        createdAt: true,
      },
    });

    // Filter by subjects in JavaScript (since they're stored as JSON strings)
    if (subjects) {
      const requestedSubjects = subjects
        .split(",")
        .map((s) => s.trim().toLowerCase());
      tutors = tutors.filter((tutor) => {
        try {
          const tutorSubjects = JSON.parse(tutor.subjects || "[]");
          return requestedSubjects.some((reqSub) =>
            tutorSubjects.some((tutSub) =>
              tutSub.toLowerCase().includes(reqSub)
            )
          );
        } catch {
          return false;
        }
      });
    }

    // Filter by classes in JavaScript
    if (classes) {
      const requestedClasses = classes
        .split(",")
        .map((c) => c.trim().toLowerCase());
      tutors = tutors.filter((tutor) => {
        try {
          const tutorClasses = JSON.parse(tutor.classes || "[]");
          return requestedClasses.some((reqClass) =>
            tutorClasses.some((tutClass) =>
              tutClass.toLowerCase().includes(reqClass)
            )
          );
        } catch {
          return false;
        }
      });
    }

    // Get total count after filtering
    const total = tutors.length;

    // Apply pagination
    const paginatedTutors = tutors.slice(skip, skip + take);

    return res.status(200).json({
      message: "Tutors retrieved successfully",
      tutors: paginatedTutors,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / take),
        hasNext: skip + paginatedTutors.length < total,
        hasPrev: Number(page) > 1,
      },
    });
  } catch (error) {
    console.error("Get All Tutors Error:", error);
    return res.status(500).json({
      message: "Failed to retrieve tutors",
      error: error.message,
    });
  }
};
