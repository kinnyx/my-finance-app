"use client";

import { useState } from "react";
import { updateTransaction } from "@/actions/transaction";

export default function EditTransactionModal({ transaction }: { transaction: any }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* ปุ่มเปิดหน้าแก้ไข */}
            <button
                onClick={() => setIsOpen(true)}
                className="text-slate-400 hover:text-blue-600 transition p-2"
            >
                ✎
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6">
                        <h3 className="text-xl font-bold mb-6">แก้ไขรายการ</h3>

                        <form 
                            action={async (FormData) => {
                                await updateTransaction(transaction.id, FormData);
                                setIsOpen(false);
                        }}
                        className="space-y-4"
                        >
                            <input 
                                name="title" 
                                defaultValue={transaction.title} 
                                className="w-full p-3 bg-slate-50 rounded-2xl outline-none" 
                                required 
                            />
                            <input 
                                name="amount" 
                                type="number" 
                                defaultValue={transaction.amount} 
                                className="w-full p-3 bg-slate-50 rounded-2xl outline-none text-2xl font-bold" 
                                required 
                            />
                            <select 
                                name="type" 
                                defaultValue={transaction.type} 
                                className="w-full p-3 bg-slate-50 rounded-2xl outline-none"
                            >
                                <option value="EXPENSE">🔴 รายจ่าย</option>
                                <option value="INCOME">🟢 รายรับ</option>
                            </select>

                            <div className="flex gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 py-3 text-slate-500 font-medium"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-bold shadow-lg"
                                >
                                    บันทึกการแก้ไข
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}