'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import AddressForm from '@/components/profile/AddressForm'
import { useAuthStore } from '@/store/authStore'
import {
    addUserAddress,
    AddressPayload,
    extractAddressesFromMutation,
} from '@/services/profileService'

const getErrorMessage = (error: unknown, fallback: string) => {
    if (isAxiosError(error)) {
        return (error.response?.data as { message?: string } | undefined)?.message || fallback
    }
    return fallback
}

export default function AddAddressPage() {
    const router = useRouter()
    const userId = useAuthStore((state) => state.user?._id)
    const setAddresses = useAuthStore((state) => state.setAddresses)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)

    const handleSubmit = async (payload: AddressPayload) => {
        if (!userId) {
            setSaveError('You need to login before adding an address.')
            return
        }

        setIsSaving(true)
        setSaveError(null)

        try {
            const response = await addUserAddress(payload)
            setAddresses((currentAddresses) => {
                return extractAddressesFromMutation(response.data, currentAddresses)
            })

            toast.success(response.message || 'Address added successfully')
            router.push('/profile/addresses')
            router.refresh()
        } catch (error: unknown) {
            setSaveError(getErrorMessage(error, 'Unable to add address'))
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <AddressForm
            title="Add Address"
            submitLabel="Add Address"
            isSaving={isSaving}
            saveError={saveError}
            onBack={() => router.back()}
            onSubmit={handleSubmit}
        />
    )
}
