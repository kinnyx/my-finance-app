"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function TransactionFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // ดึงค่าเดิมจาก URL มาแสดงในกล่อง (ถ้ามี)
    const currentStartDate = searchParams.get("startDate") || "";
    const currentEndDate = searchParams.get("endDate") || "";
    const walletId = searchParams.get("walletId") || "";

    // State สำหรับเก็บค่าที่ผู้ใช้กำลังเลือก
    const [startDate, setStartDate] = useState(currentStartDate);
    const [endDate, setEndDate] = useState(currentEndDate);

    // ฟังก์ชันกด "กรองข้อมูล"
    const handleFilter = () => {
        const params = new URLSearchParams();
        if (walletId) params.set("walletId", walletId);
        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);

        // เปลี่ยน URL เพื่อให้หน้าเว็บโหลดข้อมูลใหม่
        router.push(`/?${params.toString()}`);
    };

    // ฟังก์ชันกด "ดูทั้งหมด" (ล้างฟิลเตอร์)
    const handleClear = () => {
        setStartDate("");
        setEndDate("");
        const params = new URLSearchParams();
        if (walletId) params.set("walletId", walletId);

        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-wrap items-end gap-3 mb-4">
            <div>
                <label className="">ตั้งแต่วันที่</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2.5 text-sm bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                />
            </div>

            <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 block mb-1">ถึงวันที่</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2.5 text-sm bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                />
            </div>

            <div className="flex gap-2 ml-auto">
                {(currentStartDate || currentEndDate) && (
                    <button
                        onClick={handleClear}
                        className="px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-200 bg-slate-100 rounded-xl transition"
                    >
                        ดูทั้งหมด
                    </button>
                )}
                <button
                    onClick={handleFilter}
                    className="px-4 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition shadow-md"
                >
                    🔍 กรองข้อมูล
                </button>
            </div>
        </div>
    )
}