-- This is an empty migration.

ALTER TABLE "Score" RENAME COLUMN "Game" TO "game";
ALTER TABLE "Score" RENAME COLUMN "User" TO "user";

ALTER TABLE "Score" ADD CONSTRAINT "fk_gameId" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE;
ALTER TABLE "Score" ADD CONSTRAINT "fk_userId" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
