'use client'

import { useEffect } from 'react'
import { getCurrentUser, logoutUser } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function AuthInitializer() {
    const {
        user,
        _hasHydrated,
        setUser,
        logout
    } = useAuthStore()

    const router = useRouter()

    useEffect(() => {
        if (!_hasHydrated) return
        if (!user) return

        const clearSession = async () => {
            try {
                await logoutUser()
            } catch {
                // ignore backend logout errors
            }

            logout()
            useCartStore.getState().clearCart()
            toast.error('Please login again.')
            router.replace('/profile')
        }

        const validateSession = async () => {
            try {
                const response = await getCurrentUser()

                if (response.success) {
                    setUser(response.data)
                } else {
                    await clearSession()
                }
            } catch {
                await clearSession()
            }
        }

        validateSession()
    }, [_hasHydrated])

    return null
}