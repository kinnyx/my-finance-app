"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createTransaction(formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("คุณต้องเข้าสู่ระบบก่อน")
    }

    // 1. ดึงข้อมูลจากฟอร์มตามชื่อ 'name' ใน input
    const title = formData.get("title") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const type = formData.get("type") as string;
    const category = formData.get("category") as string;
    const walletId = formData.get("walletId") as string;

    // 2. ตรวจสอบข้อมูลเบื้องต้น (Validation)
    if (!title || isNaN(amount)) return;

    if (!walletId) throw new Error ("Missing Wallet ID");

    // 3. บันทึกลง Database ผ่าน Prisma
    await db.transaction.create({
        data: {
            title,
            amount,
            type, // "INCOME" หรือ "EXPENSE"
            category,
            walletId,
        },
    });

    // 4. สั่งให้ Next.js ทำลาย Cache หน้าแรก เพื่อดึงข้อมูลใหม่มาโชว์ทันที
    revalidatePath("/");
}

export async function updateTransaction(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const type = formData.get("type") as string;

    // อัปเดตข้อมูลตาม ID ที่ระบุ
    await db.transaction.update({
        where: { id: id },
        data: { title, amount, type },
    });

    revalidatePath("/"); // สั่งให้หน้าเว็บรีเฟรชข้อมูล
}

export async function deleteTransaction(id: string) {
    await db.transaction.delete({
        where: { id: id },
    });
    revalidatePath("/");
}

export async function deleteManyTransactions(ids: string[]) {
    await db.transaction.deleteMany({
        where: {
            id: { in: ids }, // ลบทุก ID ที่อยู่ใน List นี้
        },
    });
    revalidatePath("/");
}