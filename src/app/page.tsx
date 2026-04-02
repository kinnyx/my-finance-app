import { auth } from "@/auth";
import { db } from "@/lib/db";
// import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import AddTransactionModal from "@/components/AddTransactionModal";
import TransactionList from "@/components/TransactionList";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  // if (!session?.user?.id) {
  //   redirect("/login");
  // }

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className ="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200 text-center max-w-sm w-full animate-in zoom-in duration-300">
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

  // 1. ดึงข้อมูล Transaction ทั้งหมดจาก Database (ฝั่ง Server)
  const transactions = await db.transaction.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: { createdAt: "desc" }, // เอาอันล่าสุดขึ้นก่อน
  });

  // 2. คำนวณยอดรวม (Logic ง่ายๆ)
  const income = transactions
    .filter(t => t.type === "INCOME")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "EXPENSE")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = income - expense;

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-10 flex justify-center items-start">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-slate-200 overflow-hidden border border-white">
        {/* ส่วนหัว: แสดงยอดเงิน (Header Section) */}
        <div className="bg-slate-900 p-8 text-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">ยอดเงินคงเหลือ</p>
              <h2 className="text-4xl font-bold">$ {totalBalance.toLocaleString()}</h2>
            </div>
            {/* ปุ่มเพิ่มข้อมูล (ย้ายมาไว้เป็นปุ่มเล็กด้านบนหรือปุ่มใหญ่ด้านล่างยอดเงินก็ได้) */}
            <AddTransactionModal variant="mini" />
          </div>

          <div className="flex gap-6 pt-4 border-t border-white/10">
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

        {/* ส่วนเนื้อหา: รายการธุรกรรม (List Section)  */}
        <div className="p-2">
          <div className="px-4 py-3 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm">รายการล่าสุด</h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold">
              {transactions.length} รายการ
            </span>
          </div>

          {/* เรียกใช้ List เดิมที่เราทำไว้ แต่เอา Border ออกเพราะอยู่ในกล่องเดียวกันแล้ว */}
          <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
            <TransactionList transactions={transactions} isNested={true} />
          </div>
        </div>
        
      </div>
    </main>

  );
}
