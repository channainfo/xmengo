/*
  Warnings:

  - You are about to drop the `_InterestToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_InterestToUser" DROP CONSTRAINT "_InterestToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_InterestToUser" DROP CONSTRAINT "_InterestToUser_B_fkey";

-- DropTable
DROP TABLE "_InterestToUser";

-- CreateTable
CREATE TABLE "_UserInterest" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserInterest_AB_unique" ON "_UserInterest"("A", "B");

-- CreateIndex
CREATE INDEX "_UserInterest_B_index" ON "_UserInterest"("B");

-- AddForeignKey
ALTER TABLE "_UserInterest" ADD CONSTRAINT "_UserInterest_A_fkey" FOREIGN KEY ("A") REFERENCES "Interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserInterest" ADD CONSTRAINT "_UserInterest_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
