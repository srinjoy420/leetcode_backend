-- CreateEnum
CREATE TYPE "votetype" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "downVotes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "upVotes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ProblemRating" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "vote" "votetype" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProblemRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProblemRating" ADD CONSTRAINT "ProblemRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemRating" ADD CONSTRAINT "ProblemRating_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
