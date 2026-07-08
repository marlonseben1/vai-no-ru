-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_schedules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "data_reserva" TEXT NOT NULL,
    "refeicao" TEXT NOT NULL,
    "processado" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 0,
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "schedules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_schedules" ("created_at", "data_reserva", "id", "processado", "refeicao", "status", "user_id") SELECT "created_at", "data_reserva", "id", "processado", "refeicao", "status", "user_id" FROM "schedules";
DROP TABLE "schedules";
ALTER TABLE "new_schedules" RENAME TO "schedules";
CREATE UNIQUE INDEX "schedules_user_id_data_reserva_key" ON "schedules"("user_id", "data_reserva");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
