import api from '@/lib/api'

export const getMyOrders = async (isDelivered: boolean) => {
    const response = await api.get(`/orders/myorders?isorderdelivered=${isDelivered}`)
    return response.data
}

export const notifyPaymentDone = async (orderId: string) => {
    const response = await api.post(`/orders/notifypaymentdone/${orderId}`)
    return response.data
}