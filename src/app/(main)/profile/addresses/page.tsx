
'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, LoaderCircle, MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { useAuthStore } from '@/store/authStore'
import { deleteUserAddress } from '@/services/profileService'

const getErrorMessage = (error: unknown, fallback: string) => {
    if (isAxiosError(error)) {
        return (error.response?.data as { message?: string } | undefined)?.message || fallback
    }
    return fallback
}

export default function AddressesPage() {
    const router = useRouter()
    const userId = useAuthStore((state) => state.user?._id)

    const addresses = useAuthStore((state) => state.user?.addresses)
    const safeAddresses = addresses ?? []

    const setAddresses = useAuthStore((state) => state.setAddresses)
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    const selectedAddress = useMemo(
        () => safeAddresses.find((address) => address._id === deleteTargetId),
        [safeAddresses, deleteTargetId]
    )

    const handleDeleteAddress = async () => {
        if (!userId || !deleteTargetId) return

        setIsDeleting(true)
        setDeleteError(null)

        try {
            const response = await deleteUserAddress(
                deleteTargetId
            )
            setAddresses((currentAddresses) => {
                return currentAddresses.filter((address) => address._id !== deleteTargetId)
            })

            toast.success(response.message || 'Address removed successfully')
            setDeleteTargetId(null)
        } catch (error: unknown) {
            setDeleteError(getErrorMessage(error, 'Unable to delete address'))
        } finally {
            setIsDeleting(false)
        }
    }

    if (!userId) {
        return (
            <div className="min-h-screen max-w-2xl m-auto bg-white px-4 py-6">
                <div className="mx-auto flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className="text-lg font-semibold text-[#1E2A3A]">My Addresses</h1>
                    <div className="h-10 w-10" />
                </div>

                <div className="mx-auto mt-24 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                    <p className="text-sm text-gray-500">Please login to manage your addresses.</p>
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

    return (
        <div className="min-h-screen max-w-2xl m-auto bg-white px-4 py-6">
            <div className="mx-auto flex  items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200"
                >
                    <ArrowLeft size={18} />
                </button>

                <h1 className="text-lg font-semibold text-[#1E2A3A]">My Addresses</h1>

                <Link
                    href="/profile/addresses/add"
                    className="inline-flex h-10 items-center justify-center gap-1 rounded-full bg-[#F97316] px-3 text-sm font-semibold text-white"
                >
                    <Plus size={14} />
                    Add
                </Link>
            </div>

            <div className="mx-auto mt-6 w-full max-w-2xl">
                {safeAddresses.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                        <MapPin className="mx-auto mb-3 text-gray-400" size={24} />
                        <p className="text-base font-medium text-[#1E2A3A]">No address added yet</p>
                        <Link
                            href="/profile/addresses/add"
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-5 py-3 text-sm font-semibold text-white"
                        >
                            <Plus size={15} />
                            Add Address
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {safeAddresses.map((address) => (
                            <div
                                key={address._id || `${address.addressLine1}-${address.zipCode}`}
                                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                            >
                                <p className="text-sm font-semibold text-[#1E2A3A]">{address.addressLine1}</p>
                                {address.addressLine2 && (
                                    <p className="mt-1 text-sm text-gray-600">{address.addressLine2}</p>
                                )}
                                <p className="mt-2 text-sm text-gray-500">
                                    {address.city}, {address.state}, {address.zipCode}, {address.country}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-3">
                                    {address._id ? (
                                        <Link
                                            href={`/profile/addresses/${address._id}`}
                                            className="inline-flex items-center gap-2 rounded-lg border border-orange-200 px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
                                        >
                                            <Pencil size={14} />
                                            Edit Address
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled
                                            className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-orange-200 px-4 py-2 text-sm font-medium text-orange-600 opacity-60"
                                        >
                                            <Pencil size={14} />
                                            Edit Address
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => setDeleteTargetId(address._id || null)}
                                        disabled={!address._id}
                                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {deleteTargetId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-[#1E2A3A]">Delete address?</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            This action cannot be undone. {selectedAddress?.addressLine1 || 'Selected address'} will be removed.
                        </p>

                        {deleteError && (
                            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{deleteError}</p>
                        )}

                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteTargetId(null)}
                                disabled={isDeleting}
                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAddress}
                                disabled={isDeleting}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isDeleting ? (
                                    <>
                                        <LoaderCircle size={14} className="animate-spin" />
                                        Deleting
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}