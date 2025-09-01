/*
  Warnings:

  - The primary key for the `About` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Blog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CMSUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Career` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Certification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Education` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Publication` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SiteSettings` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_About" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_About" ("content", "createdAt", "id", "updatedAt") SELECT "content", "createdAt", "id", "updatedAt" FROM "About";
DROP TABLE "About";
ALTER TABLE "new_About" RENAME TO "About";
CREATE TABLE "new_Blog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "slug" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Blog" ("content", "createdAt", "excerpt", "id", "published", "slug", "title", "updatedAt", "views") SELECT "content", "createdAt", "excerpt", "id", "published", "slug", "title", "updatedAt", "views" FROM "Blog";
DROP TABLE "Blog";
ALTER TABLE "new_Blog" RENAME TO "Blog";
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");
CREATE TABLE "new_CMSUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_CMSUser" ("createdAt", "email", "id", "name", "password", "role", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "role", "updatedAt" FROM "CMSUser";
DROP TABLE "CMSUser";
ALTER TABLE "new_CMSUser" RENAME TO "CMSUser";
CREATE UNIQUE INDEX "CMSUser_email_key" ON "CMSUser"("email");
CREATE TABLE "new_Career" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "position" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "companyLegalName" TEXT,
    "logo" TEXT,
    "location" TEXT NOT NULL,
    "locationType" TEXT,
    "type" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "industry" TEXT,
    "link" TEXT,
    "responsibilities" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Career" ("company", "companyLegalName", "createdAt", "endDate", "id", "industry", "isActive", "link", "location", "locationType", "logo", "position", "responsibilities", "sortOrder", "startDate", "type", "updatedAt") SELECT "company", "companyLegalName", "createdAt", "endDate", "id", "industry", "isActive", "link", "location", "locationType", "logo", "position", "responsibilities", "sortOrder", "startDate", "type", "updatedAt" FROM "Career";
DROP TABLE "Career";
ALTER TABLE "new_Career" RENAME TO "Career";
CREATE UNIQUE INDEX "Career_position_company_key" ON "Career"("position", "company");
CREATE TABLE "new_Certification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "membership" TEXT NOT NULL,
    "organisation" TEXT NOT NULL,
    "logo" TEXT,
    "type" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "industry" TEXT,
    "link" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Certification" ("createdAt", "description", "endDate", "id", "industry", "isActive", "link", "logo", "membership", "organisation", "sortOrder", "startDate", "type", "updatedAt") SELECT "createdAt", "description", "endDate", "id", "industry", "isActive", "link", "logo", "membership", "organisation", "sortOrder", "startDate", "type", "updatedAt" FROM "Certification";
DROP TABLE "Certification";
ALTER TABLE "new_Certification" RENAME TO "Certification";
CREATE UNIQUE INDEX "Certification_membership_organisation_key" ON "Certification"("membership", "organisation");
CREATE TABLE "new_Education" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "degree" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "major" TEXT,
    "logo" TEXT,
    "location" TEXT,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "link" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Education" ("createdAt", "degree", "endYear", "id", "isActive", "link", "location", "logo", "major", "school", "sortOrder", "startYear", "updatedAt") SELECT "createdAt", "degree", "endYear", "id", "isActive", "link", "location", "logo", "major", "school", "sortOrder", "startYear", "updatedAt" FROM "Education";
DROP TABLE "Education";
ALTER TABLE "new_Education" RENAME TO "Education";
CREATE UNIQUE INDEX "Education_degree_school_key" ON "Education"("degree", "school");
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "image" TEXT,
    "linkDemo" TEXT,
    "linkGithub" TEXT,
    "stacks" TEXT,
    "isShow" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Project" ("createdAt", "description", "id", "image", "isFeatured", "isShow", "linkDemo", "linkGithub", "slug", "sortOrder", "stacks", "title", "updatedAt") SELECT "createdAt", "description", "id", "image", "isFeatured", "isShow", "linkDemo", "linkGithub", "slug", "sortOrder", "stacks", "title", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
CREATE TABLE "new_Publication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "journal" TEXT NOT NULL,
    "logo" TEXT,
    "location" TEXT,
    "locationType" TEXT,
    "type" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "link" TEXT,
    "overview" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Publication" ("createdAt", "id", "isActive", "journal", "link", "location", "locationType", "logo", "overview", "sortOrder", "startDate", "title", "type", "updatedAt") SELECT "createdAt", "id", "isActive", "journal", "link", "location", "locationType", "logo", "overview", "sortOrder", "startDate", "title", "type", "updatedAt" FROM "Publication";
DROP TABLE "Publication";
ALTER TABLE "new_Publication" RENAME TO "Publication";
CREATE UNIQUE INDEX "Publication_title_journal_key" ON "Publication"("title", "journal");
CREATE TABLE "new_SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'string',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSettings" ("createdAt", "description", "id", "key", "type", "updatedAt", "value") SELECT "createdAt", "description", "id", "key", "type", "updatedAt", "value" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
CREATE UNIQUE INDEX "SiteSettings_key_key" ON "SiteSettings"("key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
