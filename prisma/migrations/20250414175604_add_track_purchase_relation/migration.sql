/*
  Warnings:

  - A unique constraint covering the columns `[title,artistId]` on the table `Track` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Track_title_artistId_key" ON "Track"("title", "artistId");
