"use client"; // 👈 ต้องมี เพราะเราใช้ useState ในการเปิด-ปิด Popup

import { useState } from "react";
import { createTransaction } from "@/actions/transaction";

export default function AddTransactionModal({ variant = "full" }: { variant?: "full" | "mini" }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {variant === "mini" ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-900/20 transition-transform active:scale-90"
                >
                    +
                </button>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
                >
                    <span className="text-xl">+</span>
                </button>
            )}

            {/* 2. ตัว Popup (Modal Overlay) */}
            {isOpen && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    {/* ตัวกล่อง Modal */}
                    <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-in zoom-in duration-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-800">บันทึกรายการ</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 p-2"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* ฟอร์มที่เราเคยทำไว้ (ยกมาใส่ที่นี่) */}
                            <form 
                                action={async (FormData) => {
                                    await createTransaction(FormData);
                                    setIsOpen(false); // บันทึกเสร็จให้ปิด Popup อัตโนมัติ
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="text-sm font-medium text-slate-500 mb-1 block">ชื่อรายการ</label>
                                    <input 
                                        name="title" 
                                        type="text"
                                        placeholder="เช่น ค่ากาแฟ, เงินเดือน"
                                        className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border-none outline-none text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-500 mb-1 block">จำนวนเงิน (บาท)</label>
                                    <input 
                                        name="amount" 
                                        type="number" 
                                        step="0.01" 
                                        placeholder="0.00" 
                                        className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border-none outline-none text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition text-2xl font-bold"
                                        required 
                                    />
                                </div>

                                <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
                                    <select 
                                        name="type" 
                                        className="w-full mt-1 p-4 bg-slate-50 border-none outline-none text-slate-900 focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                                    >
                                        <option value="EXPENSE">🔴 รายจ่าย</option>
                                        <option value="INCOME">🟢 รายรับ</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">หมวดหมู่</label>
                                    <select 
                                        name="category" 
                                        className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border-none outline-none text-slate-900 focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                                    >
                                        <option value="FOOD">🍔 อาหารและเครื่องดื่ม</option>
                                        <option value="TRANSPORT">🚗 การเดินทาง</option>
                                        <option value="SHOPPING">🛍️ ช้อปปิ้ง</option>
                                        <option value="BILL">🧾 บิล/ค่าใช้จ่าย</option>
                                        <option value="INCOME">💰 รายได้</option>
                                        <option value="OTHER">✨ อื่นๆ</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition mt-4 shadow-lg shadow-blue-200"
                                >
                                    ยื่นยันการบันทึก
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}