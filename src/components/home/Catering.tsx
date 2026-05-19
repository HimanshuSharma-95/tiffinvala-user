'use client'

import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'

const highlights = [
    'Weddings & receptions',
    'Corporate lunches & events',
    'Birthday & family gatherings',
    'Bulk tiffin subscriptions',
]

export default function Catering() {
    return (
        <section className="relative py-10 pb-20 px-4 md:px-10 overflow-hidden bg-orange-50/80">

            <div className="absolute inset-y-0 right-0 w-1/2 bg-orange-50/50 -z-10 rounded-l-[4rem]" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

                {/* ── Left: Image ── */}
                {/* <div className="relative flex justify-center md:justify-end">
                    <div className="relative w-full max-w-md">

                      
                        <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl border-2 border-orange-200 -z-10" />

                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl">
                            <Image
                                src="/catering3.png"
                                alt="Catering spread of homestyle tiffin dishes"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 384px"
                            />

                        
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2.5 shadow-lg flex items-center gap-2.5">
                                <span className="text-xl">🍛</span>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Serves up to</p>
                                    <p className="text-sm font-extrabold text-[#1E2A3A]">500+ Guests</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="animate-slide-in-right">
                    <img
                        src="/catering3.png"
                        alt="Homemade Food"
                        className="w-full h-auto rounded-2xl shadow-lg"
                    />
                </div>

                {/* ── Right: Content ── */}
                <div className="flex flex-col justify-center">

                    <p className="text-[#F97316] font-semibold tracking-[0.2em] uppercase text-xs mb-4">
                        Now Available
                    </p>

                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#1E2A3A] leading-tight mb-6">
                        Catering Service <br />
                        <span className="relative inline-block">
                            for Every Occasion
                            <svg
                                className="absolute -bottom-1 left-0 w-full"
                                height="6"
                                viewBox="0 0 200 6"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M0 3 Q25 0 50 3 Q75 6 100 3 Q125 0 150 3 Q175 6 200 3"
                                    stroke="#F97316"
                                    strokeWidth="2.5"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>
                    </h2>

                    <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-8">
                        Bring the warmth of home-cooked food to your next big event.
                        Our catering service delivers fresh, flavourful tiffins made
                        with the same love and care as your daily meals — scaled up
                        for your entire gathering, on time, every time.
                    </p>

                    <ul className="space-y-3 mb-10">
                        {highlights.map((item) => (
                            <li key={item} className="flex items-center gap-3 text-[#1E2A3A] font-medium text-sm">
                                <CheckCircle2 size={18} className="text-[#F97316] shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-wrap gap-3">
                        <a
                            href="tel:+12069876543"
                            className="inline-flex items-center gap-2 bg-[#1E2A3A] text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-[#F97316] transition-colors duration-300"
                        >
                            Call to Book
                        </a>
                        <a
                            href="mailto:hello@tiffinvala.com"
                            className="inline-flex items-center gap-2 border border-gray-200 text-[#1E2A3A] text-sm font-bold px-6 py-3 rounded-full hover:border-[#F97316] hover:text-[#F97316] transition-colors duration-300"
                        >
                            Send Enquiry
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}