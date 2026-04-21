/*
  Warnings:

  - A unique constraint covering the columns `[userId,problemId]` on the table `ProblemRating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProblemRating_userId_problemId_key" ON "ProblemRating"("userId", "problemId");
