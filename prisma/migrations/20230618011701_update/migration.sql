/*
  Warnings:

  - You are about to drop the column `User.email` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `User.username` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `email` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "User.email",
DROP COLUMN "User.username",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;
