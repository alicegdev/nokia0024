-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL,
    "email" TEXT NOT NULL,
    "userId" INTEGER,
    "ownerId" INTEGER,
    CONSTRAINT "Contact_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Contact" ("email", "firstName", "id", "isFavorite", "lastName", "phoneNumber", "userId") SELECT "email", "firstName", "id", "isFavorite", "lastName", "phoneNumber", "userId" FROM "Contact";
DROP TABLE "Contact";
ALTER TABLE "new_Contact" RENAME TO "Contact";
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
