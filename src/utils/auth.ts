import { logoutUser } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'

export const handleLogout = async (
    callBackend = true,
    showToast = false
) => {
    if (callBackend) {
        try {
            await logoutUser()
        } catch { }
    }

    useAuthStore.getState().logout()
    useCartStore.getState().clearCart()
    window.location.href = '/profile'

    // if (showToast) toast.error('Please login again')
}