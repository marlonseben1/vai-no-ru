import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from './prisma/index.js';

const urlDb = process.env.DATABASE_URL ?? `file:${import.meta.dir}/../../instance.db`;
const adapter = new PrismaLibSql({ url: urlDb });

const globalParaPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma =
  globalParaPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalParaPrisma.prisma = prisma;
}
