"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // ตรวจสอบว่ามี Email นี้ในระบบหรือยัง
    const existingUser = await db.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("Email นี้ถูกใช้งานไปแล้ว");
    }

    // เข้ารหัสผ่าน (Hashing)
    // เลข 10 คือความละเอียดในการสุ่ม (Salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // บันทึก User ใหม่ลง Database
    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    // สมัครเสร็จแล้ว ส่งไปหน้า Login
    redirect("/login");
}