// (main)/layout.tsx
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/NavBar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="w-full pt-20"> {/* pt-20 = navbar height offset */}
                {children}
            </main>
            <Footer />
        </>
    )
}