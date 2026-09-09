'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const sessionId = searchParams.get('session_id')
    const orderId = searchParams.get('order_id')

    return (
        <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <CheckCircle2
                        className="h-20 w-20 text-green-500"
                    />
                </div>

                {/* Heading */}
                <h1 className="text-3xl font-bold text-gray-900">
                    Payment Successful!
                </h1>

                <p className="mt-3 text-gray-600">
                    Your payment has been successfully completed.
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

                {/* Stripe Session ID */}
                {sessionId && (
                    <div className="mt-3 rounded-xl bg-gray-50 p-4 text-left">
                        <p className="text-sm text-gray-500">
                            Payment Session
                        </p>

                        <p className="mt-1 break-all text-sm text-gray-700">
                            {sessionId}
                        </p>
                    </div>
                )}

                {/* Button */}
                <button
                    onClick={() => router.push('/profile/orders')}
                    className="mt-7 w-full rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-90"
                >
                    View My Orders
                </button>

            </div>
        </main>
    )
}
