import { signOut, auth } from "@/auth";
import { db } from "@/lib/db";
import AddTransactionModal from "@/components/AddTransactionModal";
import TransactionList from "@/components/TransactionList";
import Link from "next/link";

export default async function Home({ searchParams }: { searchParams: Promise<{ walletId?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200 text-center max-w-sm w-full animate-in zoom-in duration-300">
          <div className="text-5xl mb-6">🔒</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">การเข้าถึงถูกจำกัด</h2>
          <p className="text-slate-500 text-sm mb-8">กรุณาเข้าสู่ระบบเพื่อจัดการข้อมูลกระเป๋าเงินของคุณ</p>

          <Link
            href="/login"
            className="block w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-200"
          >
            ไปที่หน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    )
  }

  // ดึงข้อมูลกระเป๋าทั้งหมดของผู้ใช้
  const wallets = await db.wallet.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });

  // กำหนดกระเป๋าที่จะแสดง 
  const activeWalletId = resolvedSearchParams.walletId || (wallets.length > 0 ? wallets[0].id : null);
  const activeWallet = wallets.find(w => w.id === activeWalletId);

  // ดึงข้อมูล Transaction เฉพาะของกระเป๋าที่เลือก
  let transactions: any[] = [];
  if (activeWalletId) {
    transactions = await db.transaction.findMany({
      where: { walletId: activeWalletId },
      orderBy: { createdAt: "desc" },
    });
  }

  // 2. คำนวณยอดรวม (Logic ง่ายๆ)
  const income = transactions
    .filter(t => t.type === "INCOME")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "EXPENSE")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = income - expense;

  return (
    <div className="">

      {/* 👈 แถบด้านซ้าย (Sidebar) สำหรับเลือกแผนการเงิน */}
      <aside className="">
        <div className="">
          <h1 className="">
            <span>💼</span> My Wallets
          </h1>
        </div>

        {/* รายการกระเป๋าเงิน */}
        <div className="">
          {/* ตัวอย่างกระเป๋าที่ 1 (สมมติว่าถูกเลือกอยู่) */}
          <button className="">
            <p className="">กระเป๋าหลัก</p>
            <p className="">$ 25,000</p>
          </button>

          {/* ตัวอย่างกระเป๋าที่ 2 (ไม่ได้ถูกเลือก) */}
          <button className="">
            <p className="">เงินเก็บเที่ยวญี่ปุ่น</p>
            <p className="">$ 5,0000</p>
          </button>
        </div>

        {/* ปุ่มเพิ่มกระเป๋าเงินใหม่ */}
        <div className="">
          <button className="">
            <span>+</span> สร้างแผนใหม่
          </button>
        </div>

        {/* ข้อมูล User และปุ่ม Logout */}
        <div className="">
          <div className="">
            <div className="">
              {session.user.name?.charAt(0)}
            </div>
            <p className="">{session.user.name}</p>
          </div>
          <form action={async () => { "use server"; await signOut(); }}>
            <button className="">Log out</button>
          </form>
        </div>
      </aside>
    </div>
  )
}
