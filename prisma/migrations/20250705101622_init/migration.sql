/*
  Warnings:

  - You are about to drop the column `image` on the `Server` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Server" DROP COLUMN "image",
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "image",
ADD COLUMN     "imageUrl" TEXT;
