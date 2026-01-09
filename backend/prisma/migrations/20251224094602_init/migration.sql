-- CreateTable
CREATE TABLE "Tutor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "headline" TEXT,
    "bio" TEXT,
    "profilePhoto" TEXT,
    "coverPhoto" TEXT,
    "gender" INTEGER,
    "dateOfBirth" DATETIME,
    "highestEducation" TEXT,
    "institution" TEXT,
    "department" TEXT,
    "currentStatus" TEXT,
    "subjects" TEXT NOT NULL,
    "classes" TEXT NOT NULL,
    "medium" TEXT,
    "curriculum" TEXT,
    "experienceYears" INTEGER NOT NULL DEFAULT 0,
    "tuitionType" TEXT NOT NULL,
    "preferredGender" INTEGER,
    "expectedSalary" INTEGER,
    "availableDays" TEXT,
    "availableTime" TEXT,
    "willingToTravel" BOOLEAN NOT NULL DEFAULT true,
    "city" TEXT NOT NULL,
    "area" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "identityVerified" BOOLEAN NOT NULL DEFAULT false,
    "educationVerified" BOOLEAN NOT NULL DEFAULT false,
    "rating" REAL NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "totalStudents" INTEGER NOT NULL DEFAULT 0,
    "profileViews" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tutor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_userId_key" ON "Tutor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_username_key" ON "Tutor"("username");

-- CreateIndex
CREATE INDEX "Tutor_city_area_idx" ON "Tutor"("city", "area");

-- CreateIndex
CREATE INDEX "Tutor_username_idx" ON "Tutor"("username");
