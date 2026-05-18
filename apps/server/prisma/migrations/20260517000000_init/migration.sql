-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "perfil" TEXT NOT NULL,
    "matricula" TEXT,
    "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "data_reserva" TEXT NOT NULL,
    "refeicao" TEXT NOT NULL,
    "processado" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "schedules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reserva_historico" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reserva_id" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reserva_historico_reserva_id_fkey" FOREIGN KEY ("reserva_id") REFERENCES "schedules" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cardapio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "universidade" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "menu_do_dia" TEXT NOT NULL,
    "saladas" TEXT NOT NULL,
    "suco" TEXT,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_user_id_data_reserva_refeicao_key" ON "schedules"("user_id", "data_reserva", "refeicao");

-- CreateIndex
CREATE UNIQUE INDEX "cardapio_universidade_data_tipo_key" ON "cardapio"("universidade", "data", "tipo");
