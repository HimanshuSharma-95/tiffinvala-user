// app/(main)/page.tsx
import AboutUs from '@/components/home/AboutUs'
import HeroSection from '@/components/home/HeroSection'
import Testimonials from '@/components/home/Testimonials'
import ContactUs from '@/components/home/ContactUs'
import FloatingMenuButton from '@/components/home/FloatingOrderButton'
import Cattering from '@/components/home/Catering'
import FloatingWhatsappButton from '@/components/home/FloatingWhatsappButton'
import DeliveryAreas from '@/components/home/DeliveryAreas'

export default function HomePage() {
    return (
        <div className=" min-h-screen w-full">
            <div className="w-full mx-auto min-h-screen ">
                <HeroSection />
                <AboutUs />
                <Cattering />
                <DeliveryAreas />
                <Testimonials />
                <ContactUs />
            </div>
            <FloatingMenuButton />
            <FloatingWhatsappButton />
        </div>
    )
}