"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function FloatingWhatsappButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <a
            href="https://chat.whatsapp.com/EdtiNqJu2RRDaCwvFf9msV"
            target="_blank"
            rel="noopener noreferrer"
            className={`
                fixed bottom-20 right-6 z-50
                flex items-center gap-2
                bg-[#25D366] text-white
                px-4 py-2 rounded-full
                shadow-lg shadow-[#25D366]/30
                transition-all duration-500 ease-out
                hover:scale-105 hover:shadow-[#25D366]/40
                active:scale-95
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
            `}
        >
            <Image
                src="/images/whatsapp.png"
                alt="WhatsApp"
                width={28}
                height={28}
                className="object-contain shrink-0"
                style={{ width: "28px", height: "auto" }}
            />
            <span className="text-sm font-semibold tracking-wide">
                Join Community
            </span>
        </a>
    );
}