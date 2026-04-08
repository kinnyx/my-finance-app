"use client";

import { deleteWallet } from "@/actions/wallet";

export default function DeleteWalletButton({ walletId }: { walletId: string }) {
    const handleDelete = async () => {
        // ตอนนี้ใช้ confirm() ได้แล้วเพราะรันที่ Client
        const isConFirmed = window.confirm("คุณแน่ใจหรือไม่ที่จะลบกระเป๋านี้?");

        if (isConFirmed) {
            await deleteWallet(walletId);
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="text-xs text-rose-400 hover:text-rose-600 font-medium border border-rose-100 px-3 py-1 rounded-full hover:bg-rose-50 transition"
        >
            ลบแผนนี้
        </button>
    )
}