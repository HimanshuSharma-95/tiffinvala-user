'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Package, CheckCircle, Clock, Bell, ChevronDown, ChevronUp } from 'lucide-react'
import { getMyOrders, notifyPaymentDone } from '@/services/orderService'
import { Order } from '@/types/order'

type Tab = 'pending' | 'delivered'

export default function OrdersPage() {
    const router = useRouter()
    const [tab, setTab] = useState<Tab>('pending')
    const [pendingOrders, setPendingOrders] = useState<Order[]>([])
    const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [notifyingId, setNotifyingId] = useState<string | null>(null)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const hasFetched = useRef({ pending: false, delivered: false })

    useEffect(() => {
        fetchOrders('pending')
    }, [])

    useEffect(() => {
        if (tab === 'delivered' && !hasFetched.current.delivered) {
            fetchOrders('delivered')
        }
    }, [tab])

    const fetchOrders = async (type: 'pending' | 'delivered') => {
        setLoading(true)
        try {
            const res = await getMyOrders(type === 'delivered')
            if (type === 'pending') {
                setPendingOrders(res.data.orders || res.data || [])
                hasFetched.current.pending = true
            } else {
                setDeliveredOrders(res.data.orders || res.data || [])
                hasFetched.current.delivered = true
            }
        } catch {
            toast.error('Failed to load orders')
        } finally {
            setLoading(false)
        }
    }



    const handleNotifyPayment = async (
        orderId: string
    ) => {

        setNotifyingId(orderId)

        try {

            await notifyPaymentDone(orderId)

            // UPDATE PENDING
            setPendingOrders(prev =>
                prev.map(o =>
                    o.orderId === orderId
                        ? {
                            ...o,
                            paymentRequested: true
                        }
                        : o
                )
            )

            // UPDATE DELIVERED
            setDeliveredOrders(prev =>
                prev.map(o =>
                    o.orderId === orderId
                        ? {
                            ...o,
                            paymentRequested: true
                        }
                        : o
                )
            )

            toast.success(
                'Tiffinvala has been notified!'
            )

        } catch (error: any) {

            toast.error(
                error.response?.data?.message ||
                'Failed to notify'
            )

        } finally {

            setNotifyingId(null)
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-600'
            case 'pending': return 'bg-yellow-100 text-yellow-600'
            case 'cancelled': return 'bg-red-100 text-red-500'
            default: return 'bg-gray-100 text-gray-500'
        }
    }

    const orders = tab === 'pending' ? pendingOrders : deliveredOrders

    return (
        <div className="min-h-screen  max-w-2xl m-auto bg-white pb-10">

            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-4">
                <button onClick={() => router.back()}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                    <ArrowLeft size={16} />
                </button>
                <h1 className="text-lg font-bold text-[#1E2A3A]">My Orders</h1>
            </div>

            {/* Tab Toggle */}
            <div className="mx-4 mb-4">
                <div className="bg-gray-100 rounded-full p-1 flex">
                    <button
                        onClick={() => setTab('pending')}
                        className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors
                            ${tab === 'pending' ? 'bg-[#F97316] text-white' : 'text-gray-400'}`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setTab('delivered')}
                        className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors
                            ${tab === 'delivered' ? 'bg-[#F97316] text-white' : 'text-gray-400'}`}
                    >
                        Delivered
                    </button>
                </div>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="px-4 space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 gap-3 px-6">
                    <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
                        <Package size={28} className="text-[#F97316]" />
                    </div>
                    <p className="text-sm font-semibold text-[#1E2A3A]">No {tab} orders</p>
                    <p className="text-xs text-gray-400 text-center">
                        {tab === 'pending' ? 'Your active orders will appear here' : 'Your delivered orders will appear here'}
                    </p>
                    {tab === 'pending' && (
                        <button onClick={() => router.push('/menu')}
                            className="mt-2 bg-[#F97316] text-white px-6 py-2.5 rounded-xl text-sm font-semibold">
                            Order Now
                        </button>
                    )}
                </div>
            ) : (
                <div className="px-4 space-y-3">
                    {orders.map(order => (
                        <OrderCard
                            key={order.orderId}
                            order={order}
                            tab={tab}
                            expanded={expandedId === order.orderId}
                            onToggleExpand={() => setExpandedId(
                                expandedId === order.orderId ? null : order.orderId
                            )}
                            notifying={notifyingId === order.orderId}
                            onNotify={() => handleNotifyPayment(order.orderId)}
                            formatDate={formatDate}
                            getStatusColor={getStatusColor}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

// ── Order Card Component
function OrderCard({
    order, tab, expanded, onToggleExpand,
    notifying, onNotify, formatDate, getStatusColor
}: {
    order: Order
    tab: Tab
    expanded: boolean
    onToggleExpand: () => void
    notifying: boolean
    onNotify: () => void
    formatDate: (d: string) => string
    getStatusColor: (s: string) => string
}) {
    // const showPaymentNotify =
    //     tab === 'pending' &&
    //     order.payment.method !== 'online' &&
    //     order.payment.status === 'pending' &&
    //     !order.paymentRequested

    const showPaymentNotify =
        order.payment.status === 'pending' &&
        !order.paymentRequested

    const paymentRequested =
        order.payment.status === 'pending' &&
        order.paymentRequested

    const paymentConfirmed =
        order.payment.status === 'confirmed' ||
        order.payment.status === 'paid'

    return (
        <div className="border-gray-100 border bg-gray-50 rounded-2xl overflow-hidden">

            {/* Card Header */}
            <div className="px-4 pt-4 pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono text-gray-400">
                                #{order.user.username}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                            Delivery: <span className="font-semibold text-[#1E2A3A]">{formatDate(order.deliveryDate)}</span>
                        </p>

                        <p className="text-xs text-gray-400 mt-0.5">
                            {order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}
                        </p>
                    </div>

                    <div className="text-right shrink-0">
                        <p className="text-base font-bold text-[#F97316]">${order.totalAmount}</p>
                        <p className="text-xs text-gray-400">{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                {/* Payment status row */}
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1.5">
                        {paymentConfirmed ? (
                            <div className="flex items-center gap-1 bg-green-100 text-green-600 px-2.5 py-1 rounded-full">
                                <CheckCircle size={11} />
                                <span className="text-xs font-semibold">Paid</span>
                            </div>
                        ) : paymentRequested ? (
                            <div className="flex items-center gap-1 bg-blue-100 text-blue-500 px-2.5 py-1 rounded-full">
                                <Clock size={11} />
                                <span className="text-xs font-semibold">Payment Requested</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                                <span className="text-xs capitalize">{order.payment.method}</span>
                            </div>
                        )}
                    </div>

                    {/* Expand toggle */}
                    <button onClick={onToggleExpand} className="text-gray-400 p-1">
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* Payment notify banner — pending orders only */}
            {showPaymentNotify && (
                <div className="mx-4 mb-3 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2.5 flex items-start gap-2">
                    <Bell size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-xs text-[#1E2A3A]">
                            Made your payment? Let Tiffinvala know!
                        </p>
                        <button
                            onClick={onNotify}
                            disabled={notifying}
                            className="mt-1.5 bg-[#F97316] text-white text-xs px-4 py-1.5 rounded-full font-semibold disabled:opacity-60"
                        >
                            {notifying ? 'Notifying...' : 'Request as Paid'}
                        </button>
                    </div>
                </div>
            )}

            {/* Expanded items */}
            {expanded && (
                <div className="border-t border-gray-200 mx-4 pt-3 pb-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        Items
                    </p>


                    {order.items.map((item, i) => (

                        <div key={i} className="space-y-2">

                            {/* Main Item Row */}
                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-2 text-xs font-medium text-[#1E2A3A] flex-wrap">

                                    <span>
                                        {item.quantity} x
                                    </span>

                                    <p className="text-xs text-[#1E2A3A] font-medium">
                                        {item.name}
                                    </p>

                                    {item.variant?.size && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-[#F97316] font-semibold">
                                            {item.variant.size === '32oz'
                                                ? 'FULL - 32oz'
                                                : item.variant.size === '16oz'
                                                    ? 'HALF - 16oz'
                                                    : item.variant.size}
                                        </span>
                                    )}

                                    {item.type === 'combo' && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 text-[#1E2A3A]/70 font-medium">
                                            Package
                                        </span>
                                    )}

                                </div>

                                <p className="text-xs font-semibold text-[#F97316]">
                                    ${item.subtotal}
                                </p>

                            </div>

                            {/* Combo Selected Items */}
                            {item.type === 'combo' &&
                                item.selections &&
                                item.selections.length > 0 && (

                                    <div className="ml-2 flex flex-wrap gap-1.5">

                                        {item.selections.map((selection, sIndex) => (

                                            selection.products.map((product, pIndex) => (

                                                <span
                                                    key={`${sIndex}-${pIndex}`}
                                                    className="text-[10px] px-2 py-1 rounded-full bg-white border border-gray-200 text-[#1E2A3A]"
                                                >
                                                    {product.quantity}x {product.name}
                                                </span>

                                            ))

                                        ))}

                                    </div>

                                )}

                        </div>

                    ))}

                    <div className="flex items-center justify-between border-t border-gray-200 pt-2 mt-2">
                        <span className="text-xs font-bold text-[#1E2A3A]">Total</span>
                        <span className="text-sm font-bold text-[#F97316]">${order.totalAmount}</span>
                    </div>
                </div>
            )}
        </div>
    )
}