import api from '@/lib/api'
import { AddToCartPayload } from '@/types/menu'

export const getNextDeliveryDate = async () => {
    const response = await api.get('/orders/nextdeliverydate')
    return response.data
}

export const getAllProducts = async () => {
    const response = await api.get('/products/all')
    return response.data
}

export const getAllCombos = async () => {
    const response = await api.get('/products/combos')
    return response.data
}

export const viewCart = async () => {
    const response = await api.get('/orders/viewcart')
    return response.data
}

export const addToCart = async (payload: AddToCartPayload) => {
    const response = await api.post('/orders/addtocart', payload)
    return response.data
}

export const removeFromCart = async (itemId: string) => {
    const response = await api.post('/orders/removefromcart', { itemId })
    return response.data
}

export const getSingleCombo = async (
    id: string,
    area: string
) => {
    const response = await api.get(
        `/products/singlecombo/${id}?area=${area}`
    )

    return response.data
}

export const deleteCartItem = async (itemId: string) => {
    const response = await api.post('/orders/deletecartitem', { itemId })
    return response.data
}

export const clearCart = async () => {
    const response = await api.post('/orders/clearcart')
    return response.data
}

export const getProductsByArea = async (area: string) => {
    const response = await api.get(`/products/allproductsbyarea?area=${area}`)
    return response.data
}

export const getCombosByArea = async (area: string) => {
    const response = await api.get(`/products/combosbyarea?area=${area}`)
    return response.data
}


//order
export const proceedToOrder = async (data: {
    addressId: string
}) => {
    const response = await api.post(
        '/orders/proceedtoorder',
        {
            addressId: data.addressId,
            payment: {
                method: 'Pay Later'
            }
        }
    )

    return response.data
}