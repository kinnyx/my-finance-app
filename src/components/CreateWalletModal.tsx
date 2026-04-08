"use client";

import { useState } from "react";
import { createWallet } from "@/actions/wallet";

export default function CreateWalletModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full py-3 rounded-xl border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 transition flex items-center justify-center gap-2"
            >
                <span>+</span> สร้างแผนใหม่
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">สร้างแผนการเงินใหม่</h2>
                        <form action={async (FormData) => {
                            await createWallet(FormData);
                            setIsOpen(false);
                        }}>
                            <div className="mb-6">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">ชื่อแผนการเงิน</label>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="เช่น เงินออม, ท่องเที่ยว, ค่าบ้าน"
                                    className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border-none outline-none text-slate-900 focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setIsOpen(false)} 
                                    className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl">
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200"
                                >
                                    สร้างแผน
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}