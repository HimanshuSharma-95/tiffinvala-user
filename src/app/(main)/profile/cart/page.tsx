'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Trash2, Minus, Plus, ShoppingCart } from 'lucide-react'
import { viewCart, removeFromCart, addToCart, deleteCartItem, clearCart } from '@/services/menuService'
import { useCartStore } from '@/store/cartStore'
import { AddToCartPayload, ViewCartItem, ViewCartResponse } from '@/types/menu'
import Loading from '@/components/general/Loading'

export default function CartPage() {
    const router = useRouter()
    const { setItemsFromCart } = useCartStore()

    const [cart, setCart] = useState<ViewCartResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [summaryLoading, setSummaryLoading] = useState(false)
    const hasFetched = useRef(false)

    const refreshSummary = async () => {
        setSummaryLoading(true)
        try {
            const res = await viewCart()
            setCart(prev => prev ? { ...prev, summary: res.data.summary } : res.data)
        } catch {
            // todo
        } finally {
            setSummaryLoading(false)
        }
    }

    useEffect(() => {
        if (hasFetched.current) return
        hasFetched.current = true
        fetchCart()
    }, [])

    const fetchCart = async () => {
        setLoading(true)
        try {
            const response = await viewCart()
            setCart(response.data)
            syncStore(response.data.items)
        } catch {
            toast.error('Failed to load cart')
        } finally {
            setLoading(false)
        }
    }

    const syncStore = (items: ViewCartItem[]) => {
        const mapped = items.map(i => ({
            itemId: i.itemId,
            productId: i.productId || i.comboId || '',
            name: i.name,
            size:
                (i as any).variant?.size ||
                i.size ||
                '16oz',
            price:
                (i as any).variant?.price ||
                i.price ||
                i.basePrice ||
                0,
            type: i.type,
            quantity: i.quantity,
        }))
        setItemsFromCart(mapped)
    }


    const handleRemoveOne = async (
        item: ViewCartItem
    ) => {

        setActionLoading(item.itemId)

        try {

            await removeFromCart(item.itemId)

            const updatedItems =
                cart!.items
                    .map(i => {

                        // ONLY reduce clicked variant
                        if (
                            i.itemId === item.itemId
                        ) {

                            const price =
                                (i as any).variant?.price ||
                                i.price ||
                                i.basePrice ||
                                0

                            return {
                                ...i,
                                quantity: i.quantity - 1,
                                subtotal:
                                    price *
                                    (i.quantity - 1),
                            }
                        }

                        return i
                    })
                    .filter(i => i.quantity > 0)

            const newTotal =
                updatedItems.reduce(
                    (sum, i) => sum + i.subtotal,
                    0
                )

            setCart({
                ...cart!,
                items: updatedItems,
                totalAmount: newTotal,
            })

            syncStore(updatedItems)

            refreshSummary()

        } catch (error: any) {

            toast.error(
                error.response?.data?.message ||
                'Failed to remove'
            )

            fetchCart()

        } finally {

            setActionLoading(null)
        }
    }



    const handleAddOne = async (
        item: ViewCartItem
    ) => {

        if (item.type === 'combo') {
            router.push(`/menu/combo/${item.comboId}`)
            return
        }

        setActionLoading(item.itemId)

        try {

            const payload: AddToCartPayload = {
                items: [{
                    type: 'product',
                    productId: item.productId,
                    quantity: 1,

                    // IMPORTANT FIX
                    size:
                        (item as any).variant?.size ||
                        item.size ||
                        '16oz',
                }]
            }

            await addToCart(payload)

            const updatedItems =
                cart!.items.map(i => {

                    // ONLY increase SAME variant
                    if (
                        i.itemId === item.itemId
                    ) {

                        const price =
                            (i as any).variant?.price ||
                            i.price ||
                            i.basePrice ||
                            0

                        return {
                            ...i,
                            quantity: i.quantity + 1,
                            subtotal:
                                price *
                                (i.quantity + 1),
                        }
                    }

                    return i
                })

            const newTotal =
                updatedItems.reduce(
                    (sum, i) => sum + i.subtotal,
                    0
                )

            setCart({
                ...cart!,
                items: updatedItems,
                totalAmount: newTotal,
            })

            syncStore(updatedItems)

            refreshSummary()

        } catch (error: any) {

            toast.error(
                error.response?.data?.message ||
                'Failed to add'
            )

            fetchCart()

        } finally {

            setActionLoading(null)
        }
    }

    const handleRemoveAll = async (item: ViewCartItem) => {
        setActionLoading(`all-${item.itemId}`)
        try {
            await deleteCartItem(item.itemId)
            const updatedItems = cart!.items.filter(i => i.itemId !== item.itemId)
            const newTotal = updatedItems.reduce((sum, i) => sum + i.subtotal, 0)
            setCart({ ...cart!, items: updatedItems, totalAmount: newTotal })
            syncStore(updatedItems)
            toast.success(`${item.name} removed`)
            refreshSummary()    // ← updates summary in background
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to remove')
            fetchCart()
        } finally {
            setActionLoading(null)
        }
    }
    const handleClearCart = async () => {
        if (!cart || cart.items.length === 0) return
        setActionLoading('clear-all')
        try {
            await clearCart()
            setCart({ ...cart, items: [], totalAmount: 0, summary: {} })
            syncStore([])
            toast.success('Cart cleared')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to clear cart')
        } finally {
            setActionLoading(null)
        }
    }

    // ── LOADING
    if (loading) {
        return (
            <div className="min-h-screen  max-w-2xl m-auto bg-white px-4 py-6 space-y-4">
                <div className="h-8 w-24 bg-gray-100 rounded-full animate-pulse" />
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
            </div>
        )
    }

    // ── EMPTY CART
    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen  max-w-2xl m-auto bg-white flex flex-col">
                <div className="flex items-center gap-3 px-4 py-4">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <h1 className="text-lg font-bold text-[#1E2A3A]">My Cart</h1>
                </div>
                <div className="flex-1 flex flex-col mb-30 items-center justify-center gap-4 px-6">
                    <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
                        <ShoppingCart size={36} className="text-[#F97316]" />
                    </div>
                    <h2 className="text-lg font-bold text-[#1E2A3A]">Your cart is empty</h2>
                    <p className="text-sm text-gray-400 text-center">
                        Add items from the menu to get started
                    </p>
                    <button
                        onClick={() => router.push('/menu')}
                        className="bg-[#F97316] text-white px-8 py-3 rounded-xl font-semibold"
                    >
                        Browse Menu
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen max-w-2xl m-auto bg-white pb-36">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <h1 className="text-lg font-bold text-[#1E2A3A]">My Cart</h1>
                </div>
                <button
                    onClick={handleClearCart}
                    disabled={actionLoading === 'clear-all'}
                    className="text-sm font-semibold text-red-500 disabled:opacity-30"
                >
                    {actionLoading === 'clear-all' ? 'Clearing...' : 'Clear All'}
                </button>
            </div>

            {/* Items */}
            <div className="px-4 space-y-3">
                {cart.items.map(item => {
                    const isItemLoading = actionLoading === item.itemId
                    const isAllLoading = actionLoading === `all-${item.itemId}`

                    return (
                        <div
                            key={item.itemId}
                            className={`border-gray-100 border bg-gray-50 rounded-2xl p-4 transition-opacity
                                ${isItemLoading || isAllLoading ? 'opacity-60' : ''}`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-[#1E2A3A]">
                                            {item.name}
                                        </h3>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-black/5 text-[#1E2A3A]/70">
                                            {item.type === 'combo' ? 'Package' : 'Item'}
                                        </span>
                                    </div>

                                    {item.type === 'product' && (() => {

                                        const variantSize =
                                            (item as any).variant?.size ||
                                            item.size ||
                                            '16oz'

                                        const variantPrice =
                                            (item as any).variant?.price ||
                                            item.price ||
                                            0

                                        return (

                                            <div className="flex items-center gap-2 mt-1">

                                                <span
                                                    className={`text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-[#F97316]
                                                      
                                                        `}
                                                >
                                                    {variantSize === '32oz'
                                                        ? 'FULL - 32oz'
                                                        : 'HALF - 16oz'}
                                                </span>

                                                <p className="text-xs text-gray-400">
                                                    ${variantPrice} each
                                                </p>

                                            </div>
                                        )
                                    })()}

                                    {/* {item.type === 'combo' && item.selections && (
                                        <div className="mt-1 space-y-0.5">
                                            {item.fixedItems?.map((fi, i) => (
                                                <p key={i} className="text-xs text-gray-400">
                                                    {fi.title} ×{fi.quantity}
                                                </p>
                                            ))}
                                            {item.selections.map((sel, i) => (
                                                <p key={i} className="text-xs text-gray-400">
                                                    {sel.products.map((p: { name: any }) => p.name).join(', ')}
                                                </p>
                                            ))}
                                        </div>
                                    )} */}

                                    {item.type === 'combo' && (

                                        <div className="mt-2 space-y-2">

                                            {/* Combo Variant */}
                                            <div className="flex items-center gap-2 flex-wrap">

                                                {item.variant?.size && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-[#F97316] font-semibold">

                                                        {item.variant.size === '32oz'
                                                            ? 'FULL - 32oz'
                                                            : item.variant.size === '16oz'
                                                                ? 'HALF - 16oz'
                                                                : item.variant.size}

                                                    </span>
                                                )}

                                            </div>

                                            {/* Selected Combo Items */}
                                            {item.selections &&
                                                item.selections.length > 0 && (

                                                    <div className="space-y-1">

                                                        {item.selections.map(
                                                            (selection, index) => (

                                                                <div
                                                                    key={index}
                                                                    className="flex flex-wrap gap-1"
                                                                >

                                                                    {selection.products.map(
                                                                        (product, pIndex) => (

                                                                            <span
                                                                                key={pIndex}
                                                                                className="text-[10px] px-2 py-1 rounded-full bg-white border border-gray-200 text-[#1E2A3A]"
                                                                            >
                                                                                {product.quantity} x {product.name}
                                                                            </span>

                                                                        )
                                                                    )}

                                                                </div>

                                                            )
                                                        )}

                                                    </div>

                                                )}

                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleRemoveAll(item)}
                                    disabled={!!actionLoading}
                                    className="text-red-400 hover:text-red-500 disabled:opacity-30 p-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center bg-white rounded-full px-2 py-1 gap-3">
                                    <button
                                        onClick={() => handleRemoveOne(item)}
                                        disabled={!!actionLoading}
                                        className="w-6 h-6 flex items-center justify-center text-[#F97316] disabled:opacity-30"
                                    >
                                        <Minus size={13} />
                                    </button>
                                    <span className="text-sm font-bold text-[#1E2A3A] min-w-4 text-center">
                                        {isItemLoading ? <Loading size={14} /> : item.quantity}
                                    </span>
                                    <button
                                        onClick={() => handleAddOne(item)}
                                        disabled={!!actionLoading}
                                        className="w-6 h-6 flex items-center justify-center text-[#F97316] disabled:opacity-30"
                                    >
                                        <Plus size={13} />
                                    </button>
                                </div>

                                <p className="text-sm font-bold text-[#F97316]">
                                    ${item.subtotal}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Summary */}
            {cart.summary && Object.keys(cart.summary).length > 0 && (
                <div className={`mx-4 mt-4 bg-gray-50 rounded-2xl p-4 transition-opacity
                    ${summaryLoading ? 'opacity-30 pointer-events-none' : ''}`}
                >
                    <h3 className="text-sm font-bold text-[#1E2A3A] mb-3">Order Summary</h3>
                    <div className="space-y-1.5">
                        {Object.entries(cart.summary).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 capitalize">{key}</span>
                                <span className="text-xs font-semibold text-[#1E2A3A]">×{value}</span>
                            </div>
                        ))}
                        <div className="border-t border-gray-200 pt-2 mt-2 flex items-center justify-between">
                            <span className="text-sm font-bold text-[#1E2A3A]">Total Items Quantity</span>
                            <span className="text-sm font-bold text-[#1E2A3A]">
                                {Object.values(cart.summary).reduce((a, b) => a + b, 0)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Sticky Checkout */}
            {/* <div className="fixed bottom-6 left-0 right-0 px-4 z-50">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={() => router.push('/checkout')}
                        className="w-full flex items-center justify-between bg-[#F97316] text-white px-6 py-4 rounded-2xl shadow-lg"
                    >
                        <span className="font-semibold text-sm">
                            {cart.items.reduce((sum, i) => sum + i.quantity, 0)} items
                        </span>
                        <span className="font-semibold text-sm">
                            ${cart.totalAmount} · Checkout →
                        </span>
                    </button>
                </div>
            </div> */}


            <div className="fixed bottom-6 left-0 right-0 px-4 z-50">
                <div className="max-w-md mx-auto">

                    {/* Top Notice */}
                    <div className="bg-white rounded-t-2xl px-5 py-2 shadow-md border border-orange-100 border-b-0">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-gray-900">
                                Checkout
                            </span>

                            <div className="flex items-center gap-2">

                                {cart.totalAmount < 25 && (
                                    <span className="text-orange-600 font-medium">
                                        Minimum Order Quantity $25

                                    </span>
                                )}

                                <span className="text-green-600 font-medium">
                                    Free Delivery
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                        disabled={cart.totalAmount < 25}
                        onClick={() => router.push("/checkout")}
                        className={`w-full flex items-center justify-between px-6 py-4 rounded-b-2xl shadow-lg transition-all duration-200 ${cart.totalAmount >= 25
                            ? "bg-[#F97316] text-white hover:scale-[1.02]"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        <span className="font-semibold text-sm">
                            {cart.items.reduce((sum, i) => sum + i.quantity, 0)} items
                        </span>

                        <span className="font-semibold text-sm">
                            ${cart.totalAmount.toFixed(2)} · Checkout →
                        </span>
                    </button>
                </div>
            </div>

        </div>
    )
}