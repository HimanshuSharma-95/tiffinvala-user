import api from '@/lib/api'
import { ApiResponse } from '@/types/apiResponse'
import { Address } from '@/types/auth'

export interface AddressPayload {
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    zipCode: string
    country: string
    location: {
        lat: number
        lng: number
    }
}

export type AddressMutationData = Address

export const addUserAddress = async (payload: AddressPayload) => {
    const response = await api.post<ApiResponse<AddressMutationData>>('/users/address/add', payload)
    return response.data
}

export const updateUserAddress = async (userId: string, payload: AddressPayload) => {
    const response = await api.patch<ApiResponse<AddressMutationData>>(`/users/address/${userId}`, payload)
    return response.data
}

export const deleteUserAddress = async (addressId: string) => {
    const response = await api.delete<ApiResponse<AddressMutationData>>(`/users/address/${addressId}`)
    return response.data
}

export const extractAddressesFromMutation = (
    data: AddressMutationData,
    fallbackAddresses: Address[]
) => {
    if (!data) {
        return fallbackAddresses
    }

    if (!data._id) {
        return [...fallbackAddresses, data]
    }

    const index = fallbackAddresses.findIndex((address) => address._id === data._id)

    if (index === -1) {
        return [...fallbackAddresses, data]
    }

    const cloned = [...fallbackAddresses]
    cloned[index] = data
    return cloned
}
