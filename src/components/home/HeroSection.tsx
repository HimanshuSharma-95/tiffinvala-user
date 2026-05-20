'use client'

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function HeroSection() {

    const router = useRouter()
    const { isLoggedIn } = useAuthStore()

    const handleOrderNow = () => {
        if (!isLoggedIn()) {
            router.push('/profile')
            return
        }
        router.push('/menu')
    }

    return (
        <section className="md:relative md:left-1/2 md:right-1/2 md:mx-[-50vw] md:w-screen bg-white">

            {/* Responsive Image Banner */}
            <div className="w-full overflow-hidden">

                {/* Mobile Image */}
                <img
                    src="/BannerMobb.png"
                    alt="food"
                    className="w-full object-cover aspect-video md:hidden"
                />

                {/* Desktop Image */}
                <img
                    src="/BannerDeskk.png"
                    alt="food"
                    className="w-full object-cover aspect-16/7 hidden md:block"
                />
            </div>

            {/* Content */}
            <div className="px-4 md:px-10 pt-10 pb-8 flex flex-col items-center">

                <p className="text-[#1E1E1E] text-xl md:text-4xl font-extrabold text-center leading-snug ">
                    Healthy Homemade Food
                    {/* <br /> */}
                    <span className="text-[#F97316] ml-2 mr-2">
                        Delivered 50,000+
                    </span>
                    Meals
                </p>

                <p className="text-gray-500 text-sm md:text-lg mt-3 text-center max-w-3xl">
                    Fresh Tiffins
                    made with care and May contain nuts, dairy, wheat, soya, and other allergens.
                </p>

                <button
                
                    onClick={handleOrderNow}
                    className="mt-8 w-4/5 md:w-auto px-10 bg-[#F97316] hover:bg-[#1E2A3A] transition-all duration-300 text-white md:py-4 py-3 rounded-2xl font-bold tracking-wide md:text-lg text-sm shadow-lg "
                >
                    Order Now
                </button>

            </div>

        </section>
    )
}