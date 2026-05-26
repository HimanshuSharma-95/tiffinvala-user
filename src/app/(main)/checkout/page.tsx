'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    ArrowLeft,
    MapPin,
    Plus,
    ShoppingBag,
    CheckCircle2,
} from 'lucide-react'

import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { proceedToOrder } from '@/services/menuService'
import Loading from '@/components/general/Loading'

export default function CheckoutPage() {
    const router = useRouter()

    const { user } = useAuthStore()

    const {
        items,
        count,
        clearCart,
    } = useCartStore()

    const addresses = user?.addresses || []

    const [selectedAddress, setSelectedAddress] = useState<string>(
        addresses?.[0]?._id || ''
    )

    const [placingOrder, setPlacingOrder] = useState(false)

    const total = useMemo(() => {
        return items.reduce(
            (acc, item) =>
                acc + item.price * item.quantity,
            0
        )
    }, [items])

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error('Please select an address')
            return
        }

        setPlacingOrder(true)

        try {
            await proceedToOrder({
                addressId: selectedAddress,
            })

            clearCart()

            toast.success('Order placed successfully!')

            router.push('/profile/orders')

        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                'Failed to place order'
            )
        } finally {
            setPlacingOrder(false)
        }
    }

    return (
        <div className="min-h-screen max-w-2xl m-auto bg-white pb-36">

            {/* HEADER */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 sticky top-0 bg-white z-20">

                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                >
                    <ArrowLeft size={16} />
                </button>

                <div>
                    <h1 className="text-lg font-bold text-[#1E2A3A]">
                        Checkout
                    </h1>

                    <p className="text-xs text-gray-400">
                        Review and place your order
                    </p>
                </div>

            </div>

            <div className="px-4 py-4 space-y-6 max-w-2xl mx-auto">

                {/* ADDRESS SECTION */}
                <div>

                    <div className="flex items-center justify-between mb-3">

                        <div className="flex items-center gap-2">
                            <MapPin
                                size={16}
                                className="text-[#F97316]"
                            />

                            <h2 className="text-sm font-bold text-[#1E2A3A]">
                                Delivery Address
                            </h2>
                        </div>

                        <button
                            onClick={() =>
                                router.push(
                                    '/profile/addresses'
                                )
                            }
                            className="text-xs text-[#F97316] font-semibold flex items-center gap-1"
                        >
                            <Plus size={12} />
                            Add Address
                        </button>

                    </div>

                    {addresses.length === 0 ? (

                        <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">

                            <p className="text-sm font-medium text-[#1E2A3A]">
                                No addresses added yet
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                Add an address to continue checkout
                            </p>

                            <button
                                onClick={() =>
                                    router.push(
                                        '/profile/addresses/add'
                                    )
                                }
                                className="mt-4 bg-[#F97316] text-white px-5 py-2 rounded-xl text-sm font-semibold"
                            >
                                Add Address
                            </button>

                        </div>

                    ) : (

                        <div className="space-y-3">

                            {addresses.map((address: any) => {

                                const isSelected =
                                    selectedAddress === address._id

                                return (
                                    <button
                                        key={address._id}
                                        onClick={() =>
                                            setSelectedAddress(
                                                address._id
                                            )
                                        }
                                        className={`w-full text-left rounded-2xl border-2 p-4 transition-all
                                        ${isSelected
                                                ? 'border-[#F97316] bg-orange-50'
                                                : 'border-gray-100 bg-gray-50'
                                            }`}
                                    >

                                        <div className="flex items-start justify-between gap-3">

                                            <div>

                                                <p className="text-sm font-semibold text-[#1E2A3A]">
                                                    {address.name || 'Home'}
                                                </p>

                                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                    {address.addressLine1}
                                                    {address.addressLine2 && `, ${address.addressLine2}`}
                                                    {address.city && `, ${address.city}`}
                                                    {address.state && `, ${address.state}`}
                                                    {address.zipCode && ` - ${address.zipCode}`}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                    {"Phone no : "}
                                                    {user?.phone_number}
                                                </p>

                                            </div>

                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1
                                                ${isSelected
                                                        ? 'border-[#F97316] bg-[#F97316]'
                                                        : 'border-gray-300'
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <CheckCircle2
                                                        size={11}
                                                        className="text-white"
                                                    />
                                                )}
                                            </div>

                                        </div>

                                    </button>
                                )
                            })}

                        </div>

                    )}

                </div>

                {/* ORDER SUMMARY */}
                <div>

                    <div className="flex items-center gap-2 mb-3">

                        <ShoppingBag
                            size={16}
                            className="text-[#F97316]"
                        />

                        <h2 className="text-sm font-bold text-[#1E2A3A]">
                            Order Summary
                        </h2>

                    </div>

                    <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">

                        {items.map(item => (

                            <div
                                key={item.itemId}
                                className="px-4 py-3 border-b border-gray-100 last:border-none"
                            >

                                <div className="flex items-start justify-between gap-3">

                                    <div>

                                        <p className="text-sm font-semibold text-[#1E2A3A]">
                                            {item.name}
                                        </p>

                                        <div className="flex items-center gap-2 mt-1">

                                            <span
                                                className="text-xs bg-orange-50 text-[#F97316] px-2 py-0.5 rounded-full font-medium"
                                            >
                                                {item.size === '32oz'
                                                    ? 'FULL'
                                                    : 'HALF'} - {item.size}
                                            </span>

                                            <span className="text-xs text-gray-400">
                                                Qty {item.quantity}
                                            </span>

                                        </div>

                                    </div>

                                    <p className="text-sm font-bold text-[#F97316] shrink-0">
                                        ${item.price * item.quantity}
                                    </p>

                                </div>

                            </div>

                        ))}

                        {/* TOTAL */}
                        <div className="px-4 py-4 bg-white flex items-center justify-between">

                            <div>
                                <p className="text-xs text-gray-400">
                                    Total Items
                                </p>

                                <p className="text-sm font-semibold text-[#1E2A3A]">
                                    {count()} items
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-xs text-gray-400">
                                    Total Amount
                                </p>

                                <p className="text-lg font-bold text-[#F97316]">
                                    ${total.toFixed(2)}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* STICKY BUTTON */}
            {/* <div className="fixed bottom-0 max-w-2xl m-auto left-0 right-0 px-4 py-4 z-30">

                <div
                    className="
            max-w-2xl mx-auto rounded-2xl overflow-hidden
            shadow-lg border border-[#F97316]/20
        "
                >

             
                    <div className="px-6 pt-4 pb-3 bg-white text-[#1E2A3A] border-b border-[#F97316]/10">

                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#F97316]">
                            Payment
                        </p>

                        <p className="text-sm leading-relaxed text-gray-500 mt-1">
                            Venmo or Zelle payment instructions will be shared on your registered email after placing the order.
                        </p>

                    </div>

               
                    <button
                        onClick={handlePlaceOrder}
                        disabled={
                            placingOrder ||
                            !selectedAddress ||
                            items.length === 0
                        }
                        className={`
                w-full flex items-center justify-between px-6 py-4 font-semibold transition-colors hover:bg-[#da5b00]
                ${placingOrder || !selectedAddress || items.length === 0
                                ? 'bg-gray-200 text-gray-400'
                                : 'bg-[#F97316] text-white'
                            }
            `}
                    >

                        <span>
                            {placingOrder ? (
                                <div className="flex items-center gap-2">
                                    <Loading size={16} />
                                    Placing Order...
                                </div>
                            ) : (
                                'Place Order'
                            )}
                        </span>

                        <span>
                            ${total}
                        </span>

                    </button>

                </div>

            </div> */}


            <div className="fixed bottom-0 max-w-2xl m-auto left-0 right-0 px-4 py-4 z-30">

                <div
                    className="
            max-w-2xl mx-auto rounded-2xl overflow-hidden
            shadow-lg border border-[#F97316]/20
        "
                >

                    {/* Top Notice */}
                    <div className="bg-white px-5 py-2 border-b border-[#F97316]/10">
                        <div className="flex justify-center text-sm">

                            <div className="flex items-center gap-2">

                                {total < 24.99 && (
                                    <span className="text-orange-600 font-medium">
                                        Min Order $24.99
                                    </span>
                                )}

                                <span className="text-green-600 font-medium">
                                    Free Delivery
                                </span>

                            </div>

                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="px-6 pt-4 pb-3 bg-white text-[#1E2A3A] border-b border-[#F97316]/10">

                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#F97316]">
                            Payment
                        </p>

                        <p className="text-sm leading-relaxed text-gray-500 mt-1">
                            Venmo or Zelle payment instructions will be shared on your registered email after placing the order.
                        </p>

                    </div>

                    {/* CLICKABLE BUTTON */}
                    <button
                        onClick={handlePlaceOrder}
                        disabled={
                            placingOrder ||
                            !selectedAddress ||
                            items.length === 0 ||
                            total < 24.99
                        }
                        className={`
                w-full flex items-center justify-between px-6 py-4 font-semibold transition-colors
                ${placingOrder || !selectedAddress || items.length === 0 || total < 24.99
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-[#F97316] text-white hover:bg-[#da5b00]'
                            }
            `}
                    >

                        <span>
                            {placingOrder ? (
                                <div className="flex items-center gap-2">
                                    <Loading size={16} />
                                    Placing Order...
                                </div>
                            ) : (
                                'Place Order'
                            )}
                        </span>

                        <span>
                            ${total.toFixed(2)}
                        </span>

                    </button>

                </div>

            </div>



        </div>


    )
}
