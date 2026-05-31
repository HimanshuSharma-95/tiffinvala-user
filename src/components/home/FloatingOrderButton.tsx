// components/home/FloatingMenuButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { UtensilsCrossed } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getCurrentUser } from '@/services/authService'
import { toast } from 'sonner'
import { handleLogout } from '@/utils/auth'


export default function FloatingMenuButton() {
    const router = useRouter();
    const [visible, setVisible] = useState(false);

    const { isLoggedIn, _hasHydrated } = useAuthStore()

    const handleOrderNow = async () => {
        if (!_hasHydrated) return

        if (!isLoggedIn()) {
            router.push('/profile')
            return
        }

        try {
            const response = await getCurrentUser()

            if (response.success) {
                router.push('/menu')
                return
            }
        } catch { }

        await handleLogout()

        toast.error('Please login again')
        router.push('/profile')
    }

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);


    return (
        <button
            onClick={handleOrderNow}
            className={`
                fixed bottom-6 right-6 z-50
                flex items-center gap-2
                bg-[#1E2A3A] text-white
                px-5 py-3 rounded-full
                border-2 border-[#F97316]
                shadow-lg shadow-[#1E2A3A]/30
                transition-all duration-500 ease-out
                hover:bg-[#F97316] hover:shadow-[#F97316]/30 hover:scale-105
                active:scale-95
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
            `}
        >
            <UtensilsCrossed size={18} />
            <span className="text-sm font-semibold tracking-wide">Order Now</span>
        </button>
    );
}