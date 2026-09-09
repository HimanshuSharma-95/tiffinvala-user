'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'

export default function PaymentCancelPage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const orderId = searchParams.get('order_id')

    return (
        <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

                {/* Cancel Icon */}
                <div className="flex justify-center mb-6">
                    <XCircle
                        className="h-20 w-20 text-red-500"
                    />
                </div>

                {/* Heading */}
                <h1 className="text-3xl font-bold text-gray-900">
                    Payment Cancelled
                </h1>

                <p className="mt-3 text-gray-600">
                    Your payment was cancelled. No payment was completed.
                </p>

                {/* Order ID */}
                {orderId && (
                    <div className="mt-6 rounded-xl bg-gray-50 p-4 text-left">
                        <p className="text-sm text-gray-500">
                            Order ID
                        </p>

                        <p className="mt-1 break-all font-medium text-gray-900">
                            {orderId}
                        </p>
                    </div>
                )}

                {/* Buttons */}
                <div className="mt-7 flex flex-col gap-3">

                    <button
                        onClick={() => router.push('/checkout')}
                        className="w-full rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-90"
                    >
                        Return to Checkout
                    </button>

                    <button
                        onClick={() => router.push('/profile/orders')}
                        className="w-full rounded-xl border border-gray-200 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        View My Orders
                    </button>

                </div>

            </div>
        </main>
    )
}
