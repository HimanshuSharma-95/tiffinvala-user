'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { logoutUser } from '@/services/authService'
import { toast } from 'sonner'
import {
    User,
    MapPin,
    ShoppingBag,
    Heart,
    LogOut,
    ChevronRight,
    ArrowLeft,
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

const menuItems = [
    {
        group: 'account',
        items: [
            { label: 'Personal Info', icon: User, href: '/profile/personal-info', color: 'text-orange-400' },
            { label: 'Addresses', icon: MapPin, href: '/profile/addresses', color: 'text-blue-400' },
        ]
    },
    {
        group: 'orders',
        items: [
            { label: 'Cart', icon: ShoppingBag, href: '/profile/cart', color: 'text-blue-500' },
            { label: 'Orders', icon: Heart, href: '/profile/orders', color: 'text-purple-400' },
        ]
    },
]


export default function ProfilePage() {
    const router = useRouter()
    const { user, logout, isLoggedIn } = useAuthStore()
    const [mounted, setMounted] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await logoutUser()
        } catch {
            // ignore API error
        } finally {
            useCartStore.getState().clearCart()
            logout()
            toast.success('Logged out successfully')
            router.push('/')
            setIsLoggingOut(false)
        }
    }

    const initials = user?.full_name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase() || 'U'

    // ── SKELETON — prevents hydration mismatch + blank on swipe back
    if (!mounted) return <div className="min-h-screen bg-white" ></div>

    // ── NOT LOGGED IN VIEW
    if (!isLoggedIn()) {
        return (
            <div className="min-h-screen bg-white">
                <div className="flex items-center justify-between px-4 py-4">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200/90 flex items-center justify-center"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div className="w-9 h-9" />
                </div>

                <div className="flex flex-col items-center justify-center flex-1 max-w-md mx-auto px-6 mt-20 gap-6">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                        <User size={40} className="text-gray-300" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-[#1E2A3A]">You're not logged in</h2>
                        <p className="text-sm text-gray-400 mt-1">Login or create an account to continue</p>
                    </div>
                    <div className="w-full flex flex-col items-center gap-3">
                        <button
                            onClick={() => router.push('/login')}
                            className="w-65 md:w-85 bg-[#F97316] hover:bg-[#F97316]/80 text-white md:py-4 py-3 rounded-xl font-semibold tracking-wider md:text-base text-sm"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => router.push('/signup')}
                            className="w-65 md:w-85 border border-[#F97316] hover:bg-[#F97316]/10 text-[#F97316] md:py-4 py-3 rounded-xl font-semibold tracking-wider md:text-base text-sm"
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // ── LOGGED IN VIEW
    return (
        <div className={`min-h-screen bg-white${isLoggingOut ? ' pointer-events-none opacity-60' : ''}`}>
            <div className="flex items-center justify-between px-4 py-4">
                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200/90 flex items-center justify-center"
                >
                    <ArrowLeft size={16} />
                </button>
                <div className="w-9 h-9" />
            </div>

            <div className="px-6 py-6 flex flex-col items-center text-center gap-3">
                <div className="w-20 h-20 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                        <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-2xl font-bold text-orange-400">{initials}</span>
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-[#1E2A3A]">{user?.full_name}</h2>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
                {menuItems.map((group) => (
                    <div key={group.group} className="bg-gray-100 rounded-2xl overflow-hidden">
                        {group.items.map((item, index) => (
                            <button
                                key={item.label}
                                onClick={() => router.push(item.href)}
                                className={`w-full flex items-center justify-between px-4 py-4 hover:bg-gray-200 transition-colors
                                    ${index !== 0 ? 'border-t border-gray-200' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                                        <item.icon size={18} className={item.color} />
                                    </div>
                                    <span className="text-sm font-medium text-[#1E2A3A]">{item.label}</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </button>
                        ))}
                    </div>
                ))}

                <div className="bg-gray-100 rounded-2xl overflow-hidden">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className={`w-full flex items-center justify-between px-4 py-4 transition-colors
                            ${isLoggingOut ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <LogOut size={18} className="text-orange-400" />
                            </div>
                            <span className="text-sm font-medium text-[#1E2A3A]">
                                {isLoggingOut ? 'Logging out...' : 'Log Out'}
                            </span>
                        </div>
                        {!isLoggingOut && <ChevronRight size={16} className="text-gray-400" />}
                    </button>
                </div>
            </div>
        </div>
    )
}
