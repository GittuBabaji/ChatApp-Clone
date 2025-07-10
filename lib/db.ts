import { PrismaClient } from '@/lib/generated/prisma'; // 👈 Correct custom path

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export const db = prisma;
