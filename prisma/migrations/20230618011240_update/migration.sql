/*
  Warnings:

  - Added the required column `User.email` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `User.username` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "User.email" TEXT NOT NULL,
ADD COLUMN     "User.username" TEXT NOT NULL;
