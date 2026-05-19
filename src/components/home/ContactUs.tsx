'use client'

import { Mail, Phone, MapPin } from 'lucide-react'

const contactCards = [
    {
        icon: Phone,
        label: 'Phone',
        value: '+1 (661) 863-8001',
        href: 'tel:+12069139361',
    },
    {
        icon: Mail,
        label: 'Email',
        value: 'contact@tiffinvala.com',
        href: 'mailto:contact@tiffinvala.com',
    },
    {
        icon: MapPin,
        label: 'Serving',
        value: 'Seattle & Bay Area',
        href: null,
    },
]

export default function ContactUs() {
    return (
        <section className="relative py-20 px-4 md:px-10 overflow-hidden bg-orange-50/80">

            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-25 -z-10" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#1E2A3A]/10 rounded-full blur-3xl opacity-30 -z-10" />

            {/* Heading */}
            <div className="text-center mb-12">
                <p className="text-[#F97316] font-semibold tracking-[0.2em] uppercase text-xs mb-3">
                    Get In Touch
                </p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#1E2A3A] leading-tight mb-6">
                    {/* Catering for <br /> */}
                    <span className="relative inline-block">
                        Contact Us
                        {/* Underline squiggle */}
                        <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                            <path d="M0 3 Q25 0 50 3 Q75 6 100 3 Q125 0 150 3 Q175 6 200 3" stroke="#F97316" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        </svg>
                    </span>
                </h2>
                <p className="text-gray-500 mt-4 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                    Reach out anytime for orders, subscriptions, or support
                </p>
            </div>

            {/* Cards */}
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 justify-center items-stretch">
                {contactCards.map(({ icon: Icon, label, value, href }) => {
                    const inner = (
                        <div className="group relative flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 w-full">
                            {/* Icon pill */}
                            <div className="shrink-0 w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors duration-300">
                                <Icon size={20} className="text-[#F97316]" />
                            </div>

                            {/* Text */}
                            <div className="min-w-0">
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">
                                    {label}
                                </p>
                                <p className="text-sm font-bold text-[#1E2A3A] truncate">
                                    {value}
                                </p>
                            </div>

                            {/* Subtle arrow for clickable cards */}
                            {href && (
                                <svg className="ml-auto shrink-0 text-gray-300 group-hover:text-[#F97316] transition-colors duration-300" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                    )

                    return href ? (
                        <a key={label} href={href} className="flex-1">
                            {inner}
                        </a>
                    ) : (
                        <div key={label} className="flex-1">
                            {inner}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}