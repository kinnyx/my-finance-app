import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// 1. ดึง URL จาก .env
const connectionString = `${process.env.DATABASE_URL}`;

// 2. สร้าง Pool Connection (จัดการการเชื่อมต่อหลายๆ เส้นพร้อมกัน ไม่ให้ DB พัง)
const pool = new Pool({ connectionString });

// 3. เอา Pool ใส่ใน Adapter ของ Prisma
const adapter = new PrismaPg(pool);

// 4. เอา Adapter ยัดใส่ PrismaClient (มาตรฐานใหม่ V7)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;