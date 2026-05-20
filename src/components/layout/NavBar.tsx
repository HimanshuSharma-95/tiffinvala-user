"use client";

import { useRouter } from "next/navigation";
import { User, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {

    const router = useRouter();

    const { count } = useCartStore();

    // FIX HYDRATION
    const [mounted, setMounted] =
        useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const cartCount =
        mounted ? count() : 0;

    const [visible, setVisible] =
        useState(true);

    const lastScrollY =
        useRef(0);

    const ticking =
        useRef(false);

    // IOS SAFE NAVBAR SCROLL
    useEffect(() => {

        const handleScroll = () => {

            if (ticking.current) return;

            ticking.current = true;

            requestAnimationFrame(() => {

                // PREVENT NEGATIVE IOS BOUNCE VALUES
                const currentScrollY =
                    Math.max(window.scrollY, 0);

                // ALWAYS SHOW NAVBAR AT TOP
                if (currentScrollY <= 10) {

                    setVisible(true);

                    lastScrollY.current =
                        currentScrollY;

                    ticking.current = false;

                    return;
                }

                const diff =
                    currentScrollY -
                    lastScrollY.current;

                // SCROLLING DOWN
                if (diff > 8) {

                    setVisible(false);
                }

                // SCROLLING UP
                else if (diff < -6) {

                    setVisible(true);
                }

                lastScrollY.current =
                    currentScrollY;

                ticking.current = false;

            });
        };

        window.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true,
            }
        );

        return () =>
            window.removeEventListener(
                "scroll",
                handleScroll
            );

    }, []);

    return (
        <nav
            className={`
                fixed top-0 left-0 right-0 z-50
                flex items-center justify-between
                px-6 py-4
                bg-[#F0F5FA]
                shadow-sm
                transition-transform duration-300 ease-in-out
                will-change-transform
                ${visible
                    ? "translate-y-0"
                    : "-translate-y-full"
                }
            `}
        >

            {/* LOGO */}

            <div
                onClick={() =>
                    router.push("/")
                }
                className="
                    flex items-center gap-2
                    cursor-pointer
                    active:scale-[0.97]
                    transition-all duration-200 ease-out
                "
            >

                <img
                    src="/tvlogo.png"
                    alt="Tiffinvala"
                    className="h-12 w-auto"
                />

                <span className="text-2xl mt-2 font-medium text-[#1E2A3A] tracking-tight">

                    <span className="font-semibold">
                        Tiffinvala
                    </span>

                </span>

            </div>

            {/* RIGHT SECTION */}

            <div className="flex items-center gap-4">

                {/* PROFILE */}

                <div
                    onClick={() =>
                        router.push("/profile")
                    }
                    className="
                        w-12 h-12
                        flex items-center justify-center
                        rounded-full
                        bg-[#1E2A3A]
                        text-white
                        cursor-pointer
                        transition-all duration-200
                        hover:bg-[#2f4056]
                        active:scale-[0.97]
                    "
                >

                    <User size={22} />

                </div>

                {/* CART */}

                <div
                    onClick={() =>
                        router.push("/profile/cart")
                    }
                    className="
                        relative
                        w-12 h-12
                        flex items-center justify-center
                        rounded-full
                        bg-[#1E2A3A]
                        text-white
                        cursor-pointer
                        transition-all duration-200
                        hover:bg-[#2f4056]
                        active:scale-[0.97]
                    "
                >

                    <ShoppingBag size={22} />

                    {
                        mounted &&
                        cartCount > 0 && (

                            <span
                                className="
                                    absolute
                                    -top-1 -right-1
                                    bg-[#F97316]
                                    text-white
                                    text-xs
                                    font-bold
                                    min-w-5
                                    h-5
                                    px-1
                                    rounded-full
                                    flex items-center justify-center
                                "
                            >

                                {
                                    cartCount > 99
                                        ? "99+"
                                        : cartCount
                                }

                            </span>

                        )
                    }

                </div>

            </div>

        </nav>
    );
}