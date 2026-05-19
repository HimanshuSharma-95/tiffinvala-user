'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import AddressForm from '@/components/profile/AddressForm'
import { useAuthStore } from '@/store/authStore'
import {
    AddressPayload,
    extractAddressesFromMutation,
    updateUserAddress,
} from '@/services/profileService'

const getErrorMessage = (error: unknown, fallback: string) => {
    if (isAxiosError(error)) {
        return (error.response?.data as { message?: string } | undefined)?.message || fallback
    }
    return fallback
}

export default function EditAddressPage() {
    const router = useRouter()
    const params = useParams<{ id: string }>()
    const userId = useAuthStore((state) => state.user?._id)
    const addresses = useAuthStore((state) => state.user?.addresses || [])
    const setAddresses = useAuthStore((state) => state.setAddresses)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)

    const currentAddress = useMemo(
        () => addresses.find((address) => address._id === params.id),
        [addresses, params.id]
    )

    const handleSubmit = async (payload: AddressPayload) => {
        if (!userId) {
            setSaveError('You need to login before updating an address.')
            return
        }

        setIsSaving(true)
        setSaveError(null)

        try {
            const response = await updateUserAddress(params.id, {
                ...payload,
            })

            setAddresses((currentAddresses) => {
                const fallback = currentAddresses.map((address) => {
                    if (address._id === params.id) {
                        return {
                            ...address,
                            ...payload,
                        }
                    }

                    return address
                })

                return extractAddressesFromMutation(response.data, fallback)
            })

            toast.success(response.message || 'Address updated successfully')
            router.push('/profile/addresses')
            router.refresh()
        } catch (error: unknown) {
            setSaveError(getErrorMessage(error, 'Unable to update address'))
        } finally {
            setIsSaving(false)
        }
    }

    if (!userId) {
        return (
            <div className="min-h-screen bg-white px-4 py-6">
                <div className="mx-auto mt-24 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                    <p className="text-sm text-gray-500">Please login to edit an address.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="mt-4 rounded-xl bg-[#F97316] px-6 py-3 text-sm font-semibold text-white"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        )
    }

    if (!currentAddress) {
        return (
            <div className="min-h-screen bg-white px-4 py-6">
                <div className="mx-auto mt-24 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                    <p className="text-sm text-gray-500">Address not found.</p>
                    <button
                        onClick={() => router.push('/profile/addresses')}
                        className="mt-4 rounded-xl bg-[#F97316] px-6 py-3 text-sm font-semibold text-white"
                    >
                        Back to Addresses
                    </button>
                </div>
            </div>
        )
    }

    return (
        <AddressForm
            title="Edit Address"
            submitLabel="Update Address"
            initialAddress={currentAddress}
            isSaving={isSaving}
            saveError={saveError}
            onBack={() => router.back()}
            onSubmit={handleSubmit}
        />
    )
}
