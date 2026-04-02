import { signIn } from "@/auth";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden">

                {/* Header ส่วนบน */}
                <div className="bg-blue-600 p-10 text-white text-center">
                    <h1 className="text-3xl font-bold mb-2">ยินดีต้อนรับกลับมา</h1>
                    <p className="text-blue-100 text-sm">เข้าสู่ระบบเพื่อจัดการกระเป๋าเงินของคุณ</p>
                </div>

                {/* ฟอร์มเข้าสู่ระบบ */}
                <div className="p-8">
                    <form action={async (formData) => {
                        "use server";
                        try {
                            await signIn("credentials", {
                                email:  formData.get("email"),
                                password: formData.get("password"),
                                redirect: false, // login สำเร็จให้กลับหน้าแรก
                            });

                            // บังคับให้ Next.js ไปเช็ค Session ใหม่ที่หน้าแรก
                            revalidatePath("/");

                            // แล้วค่อยส่งผู้ใช้ไปหน้าแรกด้วยวิธีที่แน่นอนกว่า
                            redirect("/");
                        } catch (error) {
                            if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
                                // จัดการ Error เช่น รหัสผ่านผิด (ในที่นี้เราให้มันโยน Error ไปก่อน)
                                throw error;
                            }
                            throw error;
                        }
                    }}
                        className="space-y-5"
                    >
                        <div>
                            <label className="text-xs font-bold text-slate-500">อีเมล</label>
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
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-100 active:scale-95"
                        >
                            เข้าสู่ระบบ
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            ยังไม่มีบัญชี?{" "}
                            <Link href="/register" className="text-blue-600 font-bold hover:underline">
                                สมัครสมาชิก
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}