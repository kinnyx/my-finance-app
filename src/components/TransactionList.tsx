"use client";

import { useState } from "react";
import { deleteTransaction, deleteManyTransactions } from "@/actions/transaction";
import EditTransactionModal from "./EditTransactionModal";

export default function TransactionList({ 
    transactions, 
    isNested = false // ค่าเริ่มต้นคือ false (ถ้าไม่มีใครส่งมา)
    }: { 
        transactions: any[];
        isNested?: boolean; 
    }) {
    // สร้าง State สำหรับเก็บ ID ที่ถูกเลือก
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const CATEGORY_ICONS: Record<string, string> = {
        FOOD: "🍔",
        TRANSPORT: "🚗",
        SHOPPING: "🛍️",
        BILL: "🧾",
        INCOME: "💰",
        OTHER: "✨",
    };

    // ฟังก์ชันสลับการเลือก (Toggle)
    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex flex-col">
            {selectedIds.length > 0 && (
                <div className="px-4 py-2 bg-rose-50 border-b border-rose-100 flex justify-between items-center animate-in slide-in-from-top duration-300">
                    <span className="text-xs font-bold text-rose-600">เลือกไว้ {selectedIds.length} รายการ</span>
                    <button
                        onClick={() => {
                            if(confirm("ลบรายการที่เลือกทั้งหมด?")) {
                                deleteManyTransactions(selectedIds);
                                setSelectedIds([]);
                            }
                        }}
                        className="text-xs bg-rose-600 text-white px-3 py-1 rounded-lg font-bold"
                    >
                        ลบทิ้งทั้งหมด
                    </button>
                </div>
            )}

            {/* รายการแต่ละแถว */}
            <div className="divide-y divide-slate-100">
                {transactions.map((item) => (
                    <div
                        key={item.id}
                        className={`group p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                            selectedIds.includes(item.id) ? 'bg-blue-50/50' : ''
                        }`}
                    >
                        {/* Checkbox */}
                        <input 
                            type="checkbox" 
                            checked={selectedIds.includes(item.id)} 
                            onChange={() => toggleSelect(item.id)} 
                            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer" 
                        />

                        <div className="flex-1 min-w-0 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-lg shrink-0">
                                {CATEGORY_ICONS[item.category] || "✨"}
                            </div>

                            {/* ข้อมูลรายการ */}
                            <div>
                                <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                                <p className="text-[10px] text-slate-400 font-medium italic">
                                    {new Date(item.createdAt).toLocaleDateString('th-TH')}
                                </p>
                            </div>
                        </div>

                        {/* ยอดเงิน */}
                        <div className={`text-sm font-bold tabular-nums ${
                            item.type === 'INCOME' ? 'text-emeralkd-600' : 'text-rose-600'
                        }`}>
                            {item.type === 'INCOME' ? '+' : '-'} ${item.amount.toLocaleString()}
                        </div>

                        <div className="flex items-center gap-1">
                            <EditTransactionModal transaction={item} />
                            <button
                                onClick={() => { if(confirm("ลบรายการนี้?")) deleteTransaction(item.id); }}
                                className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}