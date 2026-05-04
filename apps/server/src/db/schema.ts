import { Database } from 'bun:sqlite';

export const db = new Database('instance.db');

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    perfil TEXT NOT NULL,
    matricula TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS schedules (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    data_reserva TEXT NOT NULL,
    refeicao TEXT NOT NULL,
    processado INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS cardapio (
    id TEXT PRIMARY KEY,
    universidade TEXT NOT NULL,
    data TEXT NOT NULL,
    tipo TEXT NOT NULL,
    menu_do_dia TEXT NOT NULL,
    saladas TEXT NOT NULL,
    suco TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(universidade, data, tipo)
  );
`);
