import { logoutUser } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

export const handleLogout = async (
    callBackend = true
) => {
    
    if (callBackend) {
        try {
            await logoutUser()
        } catch { }
    }

    useAuthStore.getState().logout()
    useCartStore.getState().clearCart()
}