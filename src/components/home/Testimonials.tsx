'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
    {
        name: 'Priya Sharma',
        location: 'Seattle',
        text: 'The dal makhani is absolutely divine! Tastes exactly like home-cooked food. I order every week now.',
        rating: 5,
        avatar: 'PS',
    },
    {
        name: 'Rahul Verma',
        location: 'Bay Area',
        text: 'Best tiffin service I have tried. Fresh, on time, and the portions are generous. Highly recommended!',
        rating: 5,
        avatar: 'RV',
    },
    {
        name: 'Anjali Singh',
        location: 'Seattle',
        text: 'The Trio combo is my go-to every week. Love that I can customize my own choices. Amazing value for money.',
        rating: 5,
        avatar: 'AS',
    },
    {
        name: 'Mohit Kapoor',
        location: 'Bay Area',
        text: 'Finally found a tiffin service that actually tastes good. The butter chicken is outstanding!',
        rating: 4,
        avatar: 'MK',
    },
]

type Direction = 'left' | 'right'
const total = testimonials.length

function useStep() {
    const [step, setStep] = useState(2)
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 768px)')
        const update = (e: MediaQueryListEvent | MediaQueryList) => setStep(e.matches ? 2 : 1)
        update(mq)
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])
    return step
}

export default function Testimonials() {
    const step = useStep()
    const pages = Math.ceil(total / step)

    const [current, setCurrent] = useState(0)
    const [prev, setPrev] = useState<number | null>(null)
    const [direction, setDirection] = useState<Direction>('right')
    const [animating, setAnimating] = useState(false)

    const dragStartX = useRef<number | null>(null)
    const isDragging = useRef(false)

    // When step changes (resize), clamp current to valid page start
    useEffect(() => {
        setCurrent((c) => Math.floor(c / step) * step)
        setPrev(null)
        setAnimating(false)
    }, [step])

    function slide(dir: Direction) {
        if (animating) return
        const next =
            dir === 'right'
                ? (current + step) % total
                : current === 0 ? (pages - 1) * step : current - step

        setPrev(current)
        setDirection(dir)
        setCurrent(next)
        setAnimating(true)
        setTimeout(() => { setPrev(null); setAnimating(false) }, 400)
    }

    function slideTo(pageIndex: number) {
        if (animating) return
        const next = pageIndex * step
        if (next === current) return
        slide(next > current ? 'right' : 'left')
    }

    const onPointerDown = (e: React.PointerEvent) => { dragStartX.current = e.clientX; isDragging.current = false }
    const onPointerMove = (e: React.PointerEvent) => {
        if (dragStartX.current === null) return
        if (Math.abs(e.clientX - dragStartX.current) > 8) isDragging.current = true
    }
    const onPointerUp = (e: React.PointerEvent) => {
        if (dragStartX.current === null) return
        const delta = e.clientX - dragStartX.current
        if (isDragging.current && Math.abs(delta) > 50) slide(delta < 0 ? 'right' : 'left')
        dragStartX.current = null
        isDragging.current = false
    }

    const outX = direction === 'right' ? '-100%' : '100%'
    const inX = direction === 'right' ? '100%' : '-100%'

    return (
        <>
            <style>{`
                @keyframes slideOut {
                    from { transform: translateX(0);               opacity: 1; }
                    to   { transform: translateX(var(--out-x));    opacity: 0; }
                }
                @keyframes slideIn {
                    from { transform: translateX(var(--in-x));     opacity: 0; }
                    to   { transform: translateX(0);               opacity: 1; }
                }
                .slide-out { animation: slideOut 0.4s cubic-bezier(.4,0,.2,1) forwards; }
                .slide-in  { animation: slideIn  0.4s cubic-bezier(.4,0,.2,1) forwards; }
            `}</style>

            <section className="py-14 px-4 md:px-10 select-none">

                {/* Heading */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E2A3A]">Happy Customers</h2>
                        <p className="text-gray-500 mt-2 text-sm md:text-base">What our customers say about us </p>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <button onClick={() => slide('left')} className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-[#1E2A3A] hover:text-[#F97316] transition-all duration-300">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => slide('right')} className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-[#1E2A3A] hover:text-[#F97316] transition-all duration-300">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Viewport */}
                <div
                    className="relative overflow-hidden cursor-grab active:cursor-grabbing"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerLeave={onPointerUp}
                >
                    {prev !== null && (
                        <div className="absolute inset-0 slide-out" style={{ '--out-x': outX } as React.CSSProperties}>
                            <Cards startIndex={prev} step={step} />
                        </div>
                    )}
                    <div className={animating ? 'slide-in' : ''} style={{ '--in-x': inX } as React.CSSProperties}>
                        <Cards startIndex={current} step={step} />
                    </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: pages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => slideTo(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${i === Math.floor(current / step) ? 'w-6 bg-[#F97316]' : 'w-2 bg-gray-200'
                                }`}
                        />
                    ))}
                </div>

                {/* Mobile arrows */}
                <div className="flex md:hidden justify-center gap-4 mt-6">
                    <button onClick={() => slide('left')} className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-[#1E2A3A] hover:text-[#F97316] transition-all duration-300">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => slide('right')} className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-[#1E2A3A] hover:text-[#F97316] transition-all duration-300">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </section>
        </>
    )
}

function Cards({ startIndex, step }: { startIndex: number; step: number }) {
    const visible = testimonials.slice(startIndex, startIndex + step)
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visible.map((t, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">
                    <div className="flex gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, s) => (
                            <span key={s} className={`text-lg ${s < t.rating ? 'text-[#F97316]' : 'text-gray-200'}`}>★</span>
                        ))}
                    </div>
                    <p className="text-gray-600 leading-relaxed text-base min-h-27.5">"{t.text}"</p>
                    <div className="flex items-center gap-4 mt-6">
                        <div className="w-12 h-12 rounded-full bg-[#1E2A3A] flex items-center justify-center">
                            <span className="text-sm font-bold text-white">{t.avatar}</span>
                        </div>
                        <div>
                            <p className="font-bold text-[#1E2A3A]">{t.name}</p>
                            <p className="text-sm text-gray-400">{t.location}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}