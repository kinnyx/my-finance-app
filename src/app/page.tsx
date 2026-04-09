import { signOut, auth } from "@/auth";
import { db } from "@/lib/db";
import AddTransactionModal from "@/components/AddTransactionModal";
import TransactionList from "@/components/TransactionList";
import Link from "next/link";
import CreateWalletModal from "@/components/CreateWalletModal";
import DeleteWalletButton from "@/components/DeleteWalletButton";
import DailyTransactionList from "@/components/DailyTransactionList";
import TransactionFilter from "@/components/TransactionFilter";

export default async function Home({ searchParams }: { searchParams: Promise<{ walletId?: string, startDate?: string, endDate?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const { walletId: urlWalletId, startDate, endDate } = resolvedSearchParams;
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
    // กำหนดเงื่อนไขเริ่มต้น คือต้องอยู่ในกระเป๋าที่เลือก
    let whereClause: any = { walletId: activeWalletId };

    // ถ้ามีการเลือกวันที่ ให้เพิ่มเงื่อนไข
    if (startDate || endDate) {
      whereClause.createdAt = {};

      // gte = Greater Than or Equal (มากกว่าหรือเท่ากัน)
      if (startDate) {
        whereClause.createdAt.gte = new Date(`${startDate}T00:00:00.000Z`);
      }

      // lte = Less Than or Equal (น้อยกว่าหรือเท่ากัน)
      if (endDate) {
        whereClause.createdAt.lte = new Date(`${endDate}T23:59:59.999Z`);
      }
    }

    transactions = await db.transaction.findMany({
      where: whereClause,
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
    <div className="flex h-screen bg-slate-500 overflow-hidden">

      {/* 👈 แถบด้านซ้าย (Sidebar) สำหรับเลือกแผนการเงิน */}
      <aside className="w-72 bg-slate-950 text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span>💼</span> My Wallets
          </h1>
        </div>

        {/* รายการกระเป๋าเงิน */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar">
          {wallets.length === 0 ? (
            <div className="text-center text-slate-500 py-4 text-sm">ยังไม่มีกระเป๋าเงิน</div>
          ) : (
            wallets.map((wallet) => (
              <Link
                key={wallet.id}
                href={`/?walletId=${wallet.id}`}
                className={`w-full text-white p-4 rounded-2xl border transition block ${activeWalletId === wallet.id
                    ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/50"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
                  }`}
              >
                <p className="font-bold text-sm">{wallet.name}</p>
              </Link>
            ))
          )}
        </div>

        {/* ปุ่มเพิ่มกระเป๋าเงินใหม่ */}
        {/* <div className="p-4 border-t border-slate-800">
          <button className="w-full py-3 rounded-xl border border-dash border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 transition flex items-center justify-center gap-2">
            <span>+</span> สร้างแผนใหม่
          </button>
        </div> */}
        <CreateWalletModal />

        {/* ข้อมูล User และปุ่ม Logout */}
        <div className="p-4 bg-slate-900 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold uppercase">
              {session.user.name?.charAt(0)}
            </div>
            <p className="text-sm font-medium text-slate-300 truncate w-24">{session.user.name}</p>
          </div>
          <form action={async () => { "use server"; await signOut(); }}>
            <button className="text-xs text-rose-400 hover:text-rose-300">Log out</button>
          </form>
        </div>
      </aside>

      {/* พื้นที่หลักด้านขวา (Main Content) */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {activeWallet ? (
            <>
              {/* Header ของกระเป๋าที่เลือก */}
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-slate-500 font-medium mb-1">กำลังดูข้อมูลของ</p>
                  <div className="flex items-center gap-4">
                    <h2 className="text-4xl font-bold text-slate-800">{activeWallet.name}</h2>
                    <DeleteWalletButton walletId={activeWallet.id}/>
                  </div>
                </div>
                <AddTransactionModal variant="mini" walletId={activeWallet.id} />
              </div>

              {/* Card สรุปยอด และ รายการธุรกรรม */}
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 p-8 text-white">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">ยอดเงินคงเหลือ</p>
                  <h2 className="text-4xl font-bold">$ {totalBalance.toLocaleString()}</h2>

                  <div className="flex gap-6 pt-6 mt-6 border-t border-white/10">
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">รายรับ</p>
                      <p className="text-emerald-400 font-bold text-lg">+ ${income.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">รายจ่าย</p>
                      <p className="text-rose-400 font-bold text-lg">- ${expense.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <div className="px-4 py-3 flex justify-between items-center mb-2">
                    <h3 className="font-bold text-slate-800 text-sm">รายการล่าสุด</h3>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold">
                      {transactions.length} รายการ
                    </span>
                  </div>

                  <div className="px-2">
                    <TransactionFilter />
                  </div>

                  <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                    <DailyTransactionList transactions={transactions} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full flex flex-col items-center justify-center text-slate-400 mt-32">
              <div className="text-6xl mb-4">💼</div>
              <h2 className="text-2xl font-bold text-slate-600 mb-2">ยังไม่มีกระเป๋าเงิน</h2>
              <p>กรุณาสร้างกระเป๋าเงินที่แถบด้านซ้ายเพื่อเริ่มต้นใช้งาน</p>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
