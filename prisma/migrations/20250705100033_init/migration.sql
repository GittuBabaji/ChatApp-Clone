/*
  Warnings:

  - You are about to drop the column `serverId` on the `Member` table. All the data in the column will be lost.
  - The `role` column on the `Member` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `profileId` on the `Server` table. All the data in the column will be lost.
  - You are about to drop the `Channel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ServerId` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileid` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MemeberRole" AS ENUM ('GUEST', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "CHANNELTYPE" AS ENUM ('TEXT', 'VOICE', 'VIDEO');

-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_serverId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_serverId_fkey";

-- DropForeignKey
ALTER TABLE "Server" DROP CONSTRAINT "Server_profileId_fkey";

-- DropIndex
DROP INDEX "Member_serverId_idx";

-- DropIndex
DROP INDEX "Server_profileId_idx";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "serverId",
ADD COLUMN     "ServerId" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "MemeberRole" NOT NULL DEFAULT 'GUEST';

-- AlterTable
ALTER TABLE "Server" DROP COLUMN "profileId",
ADD COLUMN     "profileid" TEXT NOT NULL;

-- DropTable
DROP TABLE "Channel";

-- DropTable
DROP TABLE "Profile";

-- DropEnum
DROP TYPE "ChannelType";

-- DropEnum
DROP TYPE "MemberRole";

-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "type" "CHANNELTYPE" NOT NULL DEFAULT 'TEXT',
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_userId_key" ON "profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_email_key" ON "profile"("email");

-- CreateIndex
CREATE INDEX "channel_serverId_idx" ON "channel"("serverId");

-- CreateIndex
CREATE INDEX "channel_profileId_idx" ON "channel"("profileId");

-- CreateIndex
CREATE INDEX "Member_ServerId_idx" ON "Member"("ServerId");

-- CreateIndex
CREATE INDEX "Server_profileid_idx" ON "Server"("profileid");

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_profileid_fkey" FOREIGN KEY ("profileid") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_ServerId_fkey" FOREIGN KEY ("ServerId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel" ADD CONSTRAINT "channel_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel" ADD CONSTRAINT "channel_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
