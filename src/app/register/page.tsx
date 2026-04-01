import { register } from "@/actions/auth";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden">

                {/* Header ส่วนบน */}
                <div className="bg-slate-900 p-10 text-white text-center">
                    <h1 className="text-3xl font-bold mb-2">สร้างบัญชีใหม่</h1>
                    <p className="text-slate-400 text-sm">เริ่มต้นจัดการการเงินของวันนี้</p>
                </div>

                {/* ฟอร์มสมัครสมาชิก */}
                <div className="p-8">
                    <form action={register} className="space-y-5">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">ชื่อผู้ใช้งาน</label>
                            <input 
                                name="name" 
                                type="text" 
                                placeholder="สมชาย ใจดี" 
                                className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 transition" 
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">อีเมล</label>
                            <input 
                                name="email" 
                                type="email" 
                                placeholder="example@mail.com" 
                                className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 transition" 
                                required 
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">รหัสผ่าน</label>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="••••••••" 
                                className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 transition" 
                                required 
                                minLength={6}                             
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition shadow-xl shadow-slate-200 active:scale-95"
                        >
                            สมัครสมาชิก
                        </button>
                    </form>
                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            มีบัญชีอยู่แล้ว?{" "}
                            <Link href="/login" className="text-blue-600 font-bold hover:underline">
                                เข้าสู่ระบบ
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}