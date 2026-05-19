import Link from "next/link";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#F0F5FA] pt-12 pb-6">

            <div className="max-w-6xl mx-auto px-4">

                {/* TOP SECTION */}
                <div className="grid md:grid-cols-4 gap-10 mb-10">

                    {/* LOGO + BRAND */}
                    <div>
                        <h2 className="text-xl font-bold text-[#1E2A3A] mb-3">
                            Tiffinvala
                        </h2>

                        <p className="text-gray-600 text-sm leading-relaxed">
                            Fresh homemade meals delivered to your doorstep with love and care.
                        </p>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h3 className="text-md font-semibold text-[#1E2A3A] mb-3">
                            Quick Links
                        </h3>

                        <ul className="space-y-2 text-sm text-gray-600">

                            <li>
                                <Link
                                    href="/"
                                    className="hover:text-orange-500 transition"
                                >
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/menu"
                                    className="hover:text-orange-500 transition"
                                >
                                    Menu
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/profile/cart"
                                    className="hover:text-orange-500 transition"
                                >
                                    Order Now
                                </Link>
                            </li>



                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <h3 className="text-md font-semibold text-[#1E2A3A] mb-3">
                            Contact
                        </h3>

                        <a
                            href="tel:+16618638001"
                            className="block text-sm text-gray-600 mb-2 hover:text-orange-500 transition"
                        >
                            📞 +1 (661) 863-8001
                        </a>

                        <a
                            href="mailto:contact@tiffinvala.com"
                            className="block text-sm text-gray-600 hover:text-orange-500 transition"
                        >
                            ✉️ contact@tiffinvala.com
                        </a>
                    </div>

                    {/* SOCIAL */}
                    <div>
                        <h3 className="text-md font-semibold text-[#1E2A3A] mb-3">
                            Social
                        </h3>

                        <div className="flex flex-col gap-3 text-sm text-gray-600">

                            <a
                                href=""
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-orange-500 transition"
                            >
                                <Instagram size={18} />
                                <span>Instagram</span>
                            </a>

                            <a
                                href="https://chat.whatsapp.com/EdtiNqJu2RRDaCwvFf9msV"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-orange-500 transition"
                            >
                                <MessageCircle size={18} />
                                <span>WhatsApp Community</span>
                            </a>

                            <a
                                href=""
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-orange-500 transition"
                            >
                                <Facebook size={18} />
                                <span>Facebook</span>
                            </a>

                        </div>
                    </div>

                </div>

                {/* DIVIDER */}
                <div className="border-t border-gray-300 pt-4 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Tiffinvala. All rights reserved | Hand Crafted By{" "}

                    <a
                        href="https://visionboardmedia.github.io/Contact/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F97316] hover:underline font-medium"
                    >
                        Vision Board Media
                    </a>
                </div>

            </div>
        </footer>
    );
}