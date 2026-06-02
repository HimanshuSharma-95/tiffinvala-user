// src/components/ProtectedRoute.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { isLoggedIn, _hasHydrated } = useAuthStore()

    useEffect(() => {
        if (!_hasHydrated) return
        if (!isLoggedIn()) {
            router.replace('/profile')
        }
    }, [_hasHydrated])

    if (!_hasHydrated) return <div className="min-h-screen" />

    if (!isLoggedIn()) return <div className="min-h-screen" />

    return <>{children}</>
}