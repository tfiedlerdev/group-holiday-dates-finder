/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `date_ranges` table. All the data in the column will be lost.
  - Added the required column `type` to the `date_ranges` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."RangeType" AS ENUM ('favorite', 'rather_not', 'strict_no');

-- AlterTable
ALTER TABLE "public"."date_ranges" DROP COLUMN "isAvailable",
ADD COLUMN     "type" "public"."RangeType" NOT NULL;
