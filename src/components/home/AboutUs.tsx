
export default function AboutUs() {
    return (
        <section className="py-12 md:py-20 mt-5 bg-orange-50/80">

            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">

                {/* LEFT CONTENT */}
                <div className="text-center md:text-left animate-slide-in-left">

                    {/* Eyebrow */}
                    <p className="text-[#F97316] font-semibold tracking-[0.2em] uppercase text-xs mb-4">
                        Who we are
                    </p>

                    {/* Heading */}
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#1E2A3A] leading-tight mb-6">
                        {/* Catering for <br /> */}
                        <span className="relative inline-block">
                            About Us
                            {/* Underline squiggle */}
                            <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                                <path d="M0 3 Q25 0 50 3 Q75 6 100 3 Q125 0 150 3 Q175 6 200 3" stroke="#F97316" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h2>

                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                        At <span className="font-semibold text-[#1E2A3A]">Tiffinvala</span>,
                        earlier known as <span className="font-semibold text-[#1E2A3A]">Delhi Chaska </span>
                        we bring you fresh, homemade meals crafted with care and delivered
                        straight to your doorstep.
                    </p>

                    <p className="mt-4 text-base md:text-lg text-gray-700 leading-relaxed">
                        Our goal is to make healthy eating simple, affordable, and convenient
                        for everyone. Whether you're a student or a working professional,
                        we ensure every meal is prepared with quality ingredients and a touch of home.
                    </p>

                </div>

                {/* RIGHT IMAGE */}
                {/* RIGHT IMAGE */}
                <div className="hidden md:block animate-slide-in-right">
                    <img
                        src="/aboutus.webp"
                        alt="Homemade Food"
                        className="w-full h-auto rounded-2xl shadow-lg"
                    />
                </div>

            </div>

        </section>
    );
}