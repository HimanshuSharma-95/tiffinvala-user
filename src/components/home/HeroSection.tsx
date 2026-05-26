// 'use client'

// import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/authStore";

// export default function HeroSection() {

//     const router = useRouter()
//     const { isLoggedIn, _hasHydrated } = useAuthStore()

//     const handleOrderNow = () => {
//         if (!_hasHydrated) return

//         if (!isLoggedIn()) {
//             router.push('/profile')
//             return
//         }
//         router.push('/menu')
//     }


//     return (
//         <section className="md:relative md:left-1/2 md:right-1/2 md:mx-[-50vw] md:w-screen bg-white">

//             {/* Responsive Image Banner */}
//             <div className="w-full overflow-hidden">

//                 {/* Mobile Image */}
//                 <img
//                     src="/mobbanner1.png"
//                     alt="food"
//                     className="w-full object-cover aspect-video md:hidden"
//                 />

//                 {/* Desktop Image */}
//                 <img
//                     src="/deskbanner1.png"
//                     alt="food"
//                     className="w-full object-cover aspect-16/7 hidden md:block"
//                 />
//             </div>

//             {/* Content */}
//             <div className="px-4 md:px-10 pt-10 pb-8 flex flex-col items-center">

//                 <p className="text-[#1E1E1E] text-xl md:text-4xl font-extrabold text-center leading-snug ">
//                     Healthy Homemade Food
//                     {/* <br /> */}
//                     <span className="text-[#F97316] ml-2 mr-2">
//                         Delivered 50,000+
//                     </span>
//                     Meals
//                 </p>

//                 <p className="text-gray-500 text-sm md:text-lg mt-3 text-center max-w-3xl">
//                     Fresh Tiffins
//                     made with care and May contain nuts, dairy, wheat, soya, and other allergens.
//                 </p>

//                 <button

//                     onClick={handleOrderNow}
//                     className="mt-8 w-4/5 md:w-auto px-10 bg-[#F97316] hover:bg-[#1E2A3A] transition-all duration-300 text-white md:py-4 py-3 rounded-2xl font-bold tracking-wide md:text-lg text-sm shadow-lg "
//                 >
//                     Order Now
//                 </button>

//             </div>

//         </section>
//     )
// }







'use client'

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect, useRef, useCallback } from "react";

const SLIDES = [
    { mob: "/mobbanner1.png", desk: "/deskbanner1.png" },
    { mob: "/mobbanner2.png", desk: "/deskbanner2.png" },
    // { mob: "/mobbanner3.png", desk: "/deskbanner3.png" },
];

const AUTO_SLIDE_INTERVAL = 3000;

export default function HeroSection() {
    const router = useRouter();
    const { isLoggedIn, _hasHydrated } = useAuthStore();

    const total = SLIDES.length;
    // [clone-of-last, slide0, slide1, ..., slideN-1, clone-of-first]
    const EXTENDED = [SLIDES[total - 1], ...SLIDES, SLIDES[0]];

    // Use a ref for the "real" index so timer/drag never read stale state
    const currentRef = useRef(1);
    const [displayIndex, setDisplayIndex] = useState(1); // drives transform only
    const [animated, setAnimated] = useState(true);

    // Drag state — all in refs to avoid re-renders during move
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const dragOffsetRef = useRef(0);
    const [dragOffset, setDragOffset] = useState(0); // only for visual update

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const teleportRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rafRef = useRef<number | null>(null);

    // ── Core navigation (always safe to call) ────────────────────────────────
    const goToExtended = useCallback((next: number, withAnimation = true) => {
        // Cancel any pending teleport/raf when navigating fast
        if (teleportRef.current) { clearTimeout(teleportRef.current); teleportRef.current = null; }
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }

        currentRef.current = next;
        setAnimated(withAnimation);
        setDisplayIndex(next);

        // Schedule silent teleport if we landed on a clone
        if (next === total + 1 || next === 0) {
            teleportRef.current = setTimeout(() => {
                const real = next === total + 1 ? 1 : total;
                currentRef.current = real;
                setAnimated(false);
                setDisplayIndex(real);
                teleportRef.current = null;
                // Re-enable animation after one paint
                rafRef.current = requestAnimationFrame(() => {
                    rafRef.current = requestAnimationFrame(() => {  // double-rAF for safety
                        setAnimated(true);
                        rafRef.current = null;
                    });
                });
            }, 460);
        }
    }, [total]);

    // ── Timer ─────────────────────────────────────────────────────────────────
    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            // Skip advancing if a teleport is already in-flight (prevents blank slides)
            if (teleportRef.current) return;
            goToExtended(currentRef.current + 1);
        }, AUTO_SLIDE_INTERVAL);
    }, [goToExtended]);

    useEffect(() => {
        startTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (teleportRef.current) clearTimeout(teleportRef.current);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [startTimer]);

    // ── Pointer / touch drag ──────────────────────────────────────────────────
    const onPointerDown = useCallback((e: React.PointerEvent) => {
        // Only track primary pointer (first finger / left click)
        if (!e.isPrimary) return;
        isDragging.current = true;
        dragStartX.current = e.clientX;
        dragOffsetRef.current = 0;
        setDragOffset(0);
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }, []);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging.current || !e.isPrimary) return;
        const offset = e.clientX - dragStartX.current;
        dragOffsetRef.current = offset;
        setDragOffset(offset);
    }, []);

    const onPointerUp = useCallback((e: React.PointerEvent) => {
        if (!isDragging.current || !e.isPrimary) return;
        isDragging.current = false;
        const offset = dragOffsetRef.current;
        dragOffsetRef.current = 0;
        setDragOffset(0);

        const threshold = 40;
        if (offset < -threshold) {
            goToExtended(currentRef.current + 1);
            startTimer();
        } else if (offset > threshold) {
            goToExtended(currentRef.current - 1);
            startTimer();
        }
    }, [goToExtended, startTimer]);

    // ── Misc ──────────────────────────────────────────────────────────────────
    const handleOrderNow = () => {
        if (!_hasHydrated) return;
        if (!isLoggedIn()) { router.push('/profile'); return; }
        router.push('/menu');
    };

    const activeDot =
        displayIndex === 0 ? total - 1 :
        displayIndex === total + 1 ? 0 :
        displayIndex - 1;

    const translateX = `calc(${-displayIndex * 100}% + ${dragOffset}px)`;

    return (
        <section className="md:relative md:left-1/2 md:right-1/2 md:mx-[-50vw] md:w-screen bg-white">

            {/* ── Carousel ────────────────────────────────────────────────── */}
            <div className="w-full overflow-hidden select-none">
                <div
                    className="flex"
                    style={{
                        transform: `translateX(${translateX})`,
                        transition: (isDragging.current || !animated)
                            ? "none"
                            : "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                        willChange: "transform",
                        // Critical for mobile — prevents browser scroll hijacking the drag
                        touchAction: "none",
                        cursor: isDragging.current ? "grabbing" : "grab",
                    }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                >
                    {EXTENDED.map((slide, i) => (
                        <div key={i} className="w-full shrink-0">
                            <img
                                src={slide.mob}
                                alt="Banner"
                                draggable={false}
                                className="w-full object-cover aspect-video md:hidden pointer-events-none"
                            />
                            <img
                                src={slide.desk}
                                alt="Banner"
                                draggable={false}
                                className="w-full object-cover aspect-16/7 hidden md:block pointer-events-none"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Dot indicators ──────────────────────────────────────────── */}
            <div className="flex justify-center gap-2 mt-3">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => { goToExtended(i + 1); startTimer(); }}
                        className={`rounded-full transition-all duration-300 ${
                            i === activeDot
                                ? "w-5 h-2 bg-[#F97316]"
                                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                        }`}
                    />
                ))}
            </div>

            {/* ── Content ─────────────────────────────────────────────────── */}
            <div className="px-4 md:px-10 pt-8 pb-8 flex flex-col items-center">
                <p className="text-[#1E1E1E] text-xl md:text-4xl font-extrabold text-center leading-snug">
                    Healthy Homemade Food
                    <span className="text-[#F97316] ml-2 mr-2">Delivered 50,000+</span>
                    Meals
                </p>
                <p className="text-gray-500 text-sm md:text-lg mt-3 text-center max-w-3xl">
                    Fresh Tiffins made with care and May contain nuts, dairy, wheat, soya, and other allergens.
                </p>
                <button
                    onClick={handleOrderNow}
                    className="mt-8 w-4/5 md:w-auto px-10 bg-[#F97316] hover:bg-[#1E2A3A] transition-all duration-300 text-white md:py-4 py-3 rounded-2xl font-bold tracking-wide md:text-lg text-sm shadow-lg"
                >
                    Order Now
                </button>
            </div>

        </section>
    );
}