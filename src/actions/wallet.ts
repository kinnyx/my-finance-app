"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation";

export async function createWallet(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const name = formData.get("name") as string;

    if (!name) return;

    await db.wallet.create({
        data: {
            name,
            userId: session.user.id,
        },
    });

    revalidatePath("/");
}

export async function deleteWallet(walletId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // ลบกระเป๋า (เนื่องจากเราตั้ง onDelete: Cascade ไว้ใน Prisma
    // รายการ Transaction ในกระเป๋านี้จะถูกลบออกโดยอัตโนมัติครับ)
    await db.wallet.delete({
        where: {
            id: walletId,
            userId: session.user.id, // เช็คเพื่อความปลอดภัยว่าต้องเป็นเจ้าของจริงๆ
        },
    });

    revalidatePath("/");
    redirect("/"); // ลบเสร็จให้เด้งกลับหน้าแรก (เพื่อไปโหลดกระเป๋าใบที่เหลือ)
}