"use client"

import React, { useState } from "react"
import { deleteTransaction, deleteManyTransactions } from "@/actions/transaction";
import EditTransactionModal from "./EditTransactionModal";

//หมวดหมู่ไอคอน
const CATEGORY_ICONS: Record<string, string> = {
    FOOD: "🍔",
    TRANSPORT: "🚗",
    SHOPPING: "🛍️",
    BILL: "🧾",
    INCOME: "💰",
    OTHER: "✨",
};

export default function DailyTransactionList({ transactions }: { transactions: any[] }) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // ฟังก์ชันสำหรับจัดกลุ่มรายการตาม "วันที่"
    const groupedTransactions = transactions.reduce((acc, transaction) => {
        // แปลงวันที่เป็นรูปแบบภาษาไทย เช่น "15 ต.ค. 2569"
        const dateObj = new Date(transaction.createdAt);
        const dateKey = dateObj.toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

        // ถ้ายังไม่มีกลุ่มของวันนี้ ให้สร้างใหม่
        if (!acc[dateKey]) {
            acc[dateKey] = {
                items: [],
                dailyIncome: 0,
                dailyExpense: 0,
            };
        }

        // เอารายการใส่เข้าไปในกลุ่มวันนี้
        acc[dateKey].items.push(transaction);

        // คำนวณยอดรวมของวันนี้ (ถ้ารายรับ + ถ้ารายจ่าย -)
        if (transaction.type === "INCOME") {
            acc[dateKey].dailyIncome += transaction.amount;
        } else {
            acc[dateKey].dailyExpense += transaction.amount;
        }

        return acc;
    }, {} as Record<string, { items: any[]; dailyIncome: number; dailyExpense: number }>);

    // ถ้าไม่มีรายการเลย
    if (transactions.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400">
                <p className="text-4xl mb-3">📝</p>
                <p>ยังไม่มีรายการธุรกรรมในกระเป๋านี้</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 relative">
            {selectedIds.length > 0 && (
                <div className="sticky top-0 z-10 mb-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-2xl flex justify-between items-center shadow-sm animate-in fade-in slide-in-from-top-2">
                    <span className="text-xs font-bold text-rose-600">เลือกไว้ {selectedIds.length} รายการ</span>
                    <button
                        onClick={async () => {
                            if (window.confirm("ลบรายการที่เลือกทั้งหมด?")) {
                                await deleteManyTransactions(selectedIds);
                                setSelectedIds([]);
                            }
                        }}
                        className="text-xs bg-rose-600 text-white px-4 py-2 rounded-xl font-bold shadow-md hover:bg-rose-700 transition"
                    >
                        ลบทิ้งทั้งหมด
                    </button>
                </div>
            )}
            {/* วนลูปแสดงผลตาม "กลุ่มวันที่" */}
            {Object.keys(groupedTransactions).map((date) => {
                const group = groupedTransactions[date];

                return (
                    <div key={date} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* แถบหัวข้อของแต่ละวัน (Header) */}
                        <div className="flex justify-between items-center mb-3 px-2 border-b border-slate-100 pb-2">
                            <h3 className="font-bold text-slate-700 text-sm">{date}</h3>

                            <div className="flex gap-4 items-center">
                                {/* แสดงยอดรายรับรายวัน */}
                                {group.dailyIncome > 0 && (
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">รายรับ</span>
                                        <p className="text-xs font-bold text-emerald-500">
                                            + $ {group.dailyIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                )}
                                {/* แสดงยอดรายจ่ายรายวัน */}
                                {group.dailyExpense > 0 && (
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">รายจ่าย</span>
                                        <p className="text-xs font-bold text-rose-500">
                                            - $ {group.dailyExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* รายการในวันนั้นๆ (Items) */}
                        <div className="flex flex-col gap-2">
                            {group.items.map((item: any) => (
                                <div
                                    key={item.id}
                                    className={`bg-slate-50 transition p-3 rounded-2xl flex items-center justify-between group border ${
                                        selectedIds.includes(item.id) 
                                        ? 'bg-blue-50 border-blue-200' 
                                        : 'border-transparent hover:bg-slate-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => toggleSelect(item.id)}
                                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer mr-1"
                                        />

                                        {/* ไอคอนหมวดหมู่ */}
                                        <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-xl border border-slate-100 shrink-0">
                                            {CATEGORY_ICONS[item.category] || "✨"}
                                        </div>

                                        {/* ชื่อรายการ */}
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-800 truncate">{item.title}</p>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                                {item.category}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">

                                        {/* ยอดเงิน */}
                                        <div className="text-right">
                                            <p className={`text-sm font-bold ${item.type === "INCOME" ? "text-emerald-500" : "text-slate-800"}`}>
                                                {item.type === "INCOME" ? "+" : "-"}$ {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium">
                                                {new Date(item.createdAt).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.
                                            </p>
                                        </div>

                                        {/* ปุ่ม Action (มีเส้นคั่นบางๆ) */}
                                        <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                                            <EditTransactionModal transaction={item} />
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm("ลบรายการนี้?")) {
                                                        await deleteTransaction(item.id);
                                                    }
                                                }}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}