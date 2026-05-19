// components/home/FloatingMenuButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { UtensilsCrossed } from "lucide-react";
import { useState, useEffect } from "react";

export default function FloatingMenuButton() {
    const router = useRouter();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <button
            onClick={() => router.push("/menu")}
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