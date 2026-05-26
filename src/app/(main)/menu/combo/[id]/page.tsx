'use client'

import { useState, useEffect, useRef } from 'react'
import {
    useRouter,
    useParams,
    useSearchParams
} from 'next/navigation'

import { toast } from 'sonner'

import {
    ArrowLeft,
    Check,
    ShoppingCart
} from 'lucide-react'

import {
    getSingleCombo,
    addToCart,
} from '@/services/menuService'

import {
    Combo,
    ComboRule,
    AddToCartPayload,
} from '@/types/menu'

type Area = 'seattle' | 'bay_area'

export default function ComboDetailPage() {

    const router = useRouter()
    const params = useParams()
    const comboId = params.id as string
    const searchParams = useSearchParams()

    const area =
        (searchParams.get('area') as Area)
        || 'seattle'

    const [combo, setCombo] =
        useState<Combo | null>(null)

    const [loading, setLoading] =
        useState(true)

    const [addingToCart, setAddingToCart] =
        useState(false)

    /**
     * selections
     *
     * {
     *   ruleId: {
     *      productId: quantity
     *   }
     * }
     */

    const [selections, setSelections] = useState<
        Record<string, Record<string, number>>
    >({})

    const isFetched = useRef(false)

    useEffect(() => {

        if (!isFetched.current) {

            fetchCombo()
            isFetched.current = true
        }

    }, [comboId])

    /**
     * auto select
     */

    useEffect(() => {

        if (!combo) return

        const autoSelections:
            Record<string, Record<string, number>> = {}

        combo.rules.forEach(rule => {

            if (
                !rule.allowCustomSelection &&
                !rule.isFixed &&
                rule.products?.length
            ) {

                const obj:
                    Record<string, number> = {}

                // single product
                // assign full quantity
                if (rule.products.length === 1) {

                    obj[rule.products[0]._id] =
                        rule.quantity

                } else {

                    rule.products
                        .slice(0, rule.quantity)
                        .forEach(product => {

                            obj[product._id] = 1
                        })
                }

                autoSelections[rule._id] = obj
            }
        })

        setSelections(prev => ({
            ...prev,
            ...autoSelections
        }))

    }, [combo])

    const fetchCombo = async () => {

        setLoading(true)

        try {

            const response =
                await getSingleCombo(comboId, area)

            setCombo(response.data)

        } catch {

            toast.error('Failed to load combo')
            router.back()

        } finally {

            setLoading(false)
        }
    }

    /**
     * total selected in rule
     */

    const getRuleTotalSelected = (
        ruleId: string
    ) => {

        const ruleSelections =
            selections[ruleId] || {}

        return Object.values(ruleSelections)
            .reduce((sum, qty) => sum + qty, 0)
    }

    /**
     * qty of single product
     */

    const getProductQuantity = (
        ruleId: string,
        productId: string
    ) => {

        return selections[ruleId]?.[productId] || 0
    }

    /**
     * add/remove qty
     */

    const updateProductQuantity = (
        rule: ComboRule,
        productId: string,
        action: 'add' | 'remove'
    ) => {

        setSelections(prev => {

            const currentRule =
                prev[rule._id] || {}

            const currentQty =
                currentRule[productId] || 0

            const totalSelected =
                Object.values(currentRule)
                    .reduce(
                        (sum, qty) => sum + qty,
                        0
                    )

            /**
             * ADD
             */

            if (action === 'add') {

                if (
                    totalSelected >= rule.quantity
                ) {
                    return prev
                }

                return {
                    ...prev,
                    [rule._id]: {
                        ...currentRule,
                        [productId]:
                            currentQty + 1
                    }
                }
            }

            /**
             * REMOVE
             */

            if (currentQty <= 1) {

                const updated = {
                    ...currentRule
                }

                delete updated[productId]

                return {
                    ...prev,
                    [rule._id]: updated
                }
            }

            return {
                ...prev,
                [rule._id]: {
                    ...currentRule,
                    [productId]:
                        currentQty - 1
                }
            }
        })
    }

    /**
     * validation
     */

    const isValid = () => {

        if (!combo) return false

        return combo.rules.every(rule => {

            if (
                rule.isFixed
                || !rule.allowCustomSelection
            ) {
                return true
            }

            if (rule.isOptional) {
                return true
            }

            const totalSelected =
                getRuleTotalSelected(rule._id)

            return (
                totalSelected === rule.quantity
            )
        })
    }

    /**
     * add to cart
     */

    const handleAddToCart = async () => {

        if (!combo || !isValid()) return

        setAddingToCart(true)

        try {

            const selectionPayload =
                combo.rules
                    .filter(rule => !rule.isFixed)
                    .map(rule => ({

                        ruleId: rule._id,

                        products: Object.entries(
                            selections[rule._id] || {}
                        ).map(
                            ([productId, quantity]) => ({

                                productId,
                                quantity

                            })
                        )
                    }))

            const payload:
                AddToCartPayload = {

                items: [{
                    type: 'combo',
                    comboId: combo._id,
                    quantity: 1,
                    selections: selectionPayload,
                }]
            }

            await addToCart(payload)

            toast.success(
                `${combo.name} added to cart!`
            )

            router.push('/profile/cart')

        } catch (error: any) {

            toast.error(
                error.response?.data?.message
                || 'Failed to add to cart'
            )

        } finally {

            setAddingToCart(false)
        }
    }

    /**
     * loading
     */

    if (loading) {

        return (
            <div className="min-h-screen max-w-2xl m-auto bg-white px-4 py-6 space-y-4">

                <div className="h-8 w-32 bg-gray-100 rounded-full animate-pulse" />

                <div className="h-6 w-48 bg-gray-100 rounded-full animate-pulse" />

                <div className="space-y-3 mt-6">

                    {[1, 2, 3].map(i => (

                        <div
                            key={i}
                            className="h-32 bg-gray-100 rounded-2xl animate-pulse"
                        />
                    ))}

                </div>

            </div>
        )
    }

    if (!combo) return null

    /**
     * progress
     */

    const requiredRules =
        combo.rules.filter(
            r =>
                !r.isFixed
                &&
                r.allowCustomSelection
                &&
                !r.isOptional
        )

    const completedRules =
        requiredRules.filter(
            r =>
                getRuleTotalSelected(r._id)
                === r.quantity
        )

    return (

        <div className="min-h-screen max-w-2xl m-auto bg-white pb-32">

            {/* HEADER */}

            <div className="flex items-center gap-3 px-4 py-4">

                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                >
                    <ArrowLeft size={16} />
                </button>

                <div>

                    <h1 className="text-lg font-bold text-[#1E2A3A]">
                        {combo.name}
                    </h1>

                    {combo.description && (
                        <p className="text-xs text-gray-400">
                            {combo.description}
                        </p>
                    )}

                </div>

            </div>

            {/* PRICE */}

            <div className="mx-4 bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 flex items-center justify-between">

                <div>

                    <p className="text-xs text-gray-400">
                        Package Price
                    </p>

                    <p className="text-lg font-bold text-[#F97316]">
                        ${combo.price}
                    </p>

                </div>

                <div className="text-right">

                    <p className="text-xs text-gray-400">
                        Size
                    </p>

                    <p className="text-sm font-semibold text-[#1E2A3A]">
                        {combo.size}
                    </p>

                </div>

            </div>

            {/* PROGRESS */}

            {requiredRules.length > 0 && (

                <div className="mx-4 mt-3 flex items-center gap-2">

                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">

                        <div
                            className="bg-[#F97316] h-1.5 rounded-full transition-all"
                            style={{
                                width: `${(
                                    completedRules.length
                                    /
                                    requiredRules.length
                                ) * 100}%`
                            }}
                        />

                    </div>

                    <span className="text-xs text-gray-400">
                        {completedRules.length}
                        /
                        {requiredRules.length}
                        {' '}done
                    </span>

                </div>
            )}

            {/* RULES */}

            <div className="px-4 mt-4 space-y-5">

                {combo.rules.map(rule => (

                    <div key={rule._id}>

                        {/* RULE HEADER */}

                        <div className="flex items-center justify-between mb-2">

                            <div>

                                <h3 className="text-sm font-bold text-[#1E2A3A]">
                                    {rule.label}
                                </h3>

                                <p className="text-xs text-gray-400">

                                    {rule.isFixed
                                        ? `Included: ${rule.quantity}`
                                        : rule.label}

                                    {rule.isOptional && ' (optional)'}

                                </p>

                            </div>

                            {!rule.isFixed
                                &&
                                rule.allowCustomSelection && (

                                    <div
                                        className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full
                                        ${getRuleTotalSelected(rule._id)
                                                === rule.quantity
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-gray-100 text-gray-400'
                                            }`}
                                    >

                                        {getRuleTotalSelected(rule._id)
                                            === rule.quantity && (
                                                <Check size={10} />
                                            )}

                                        {getRuleTotalSelected(rule._id)}
                                        /
                                        {rule.quantity}

                                    </div>
                                )}

                        </div>

                        {/* PRODUCTS */}

                        {!rule.isFixed
                            &&
                            rule.products
                            &&
                            rule.products.length > 0 && (

                                <div className="space-y-2">

                                    {rule.products.map(product => {

                                        const quantity =
                                            rule.allowCustomSelection
                                                ? getProductQuantity(
                                                    rule._id,
                                                    product._id
                                                )
                                                : (
                                                    selections?.[rule._id]?.[product._id]
                                                    || rule.quantity
                                                )

                                        const isSelected =
                                            quantity > 0

                                        return (

                                            <div
                                                key={product._id}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all
                                                ${isSelected
                                                        ? 'border-[#F97316] bg-orange-50'
                                                        : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            >

                                                <div>

                                                    <p className="text-sm font-medium text-[#1E2A3A]">
                                                        {product.name}
                                                    </p>

                                                    {product.variants[0].size !== 'default' && (

                                                        <p className="text-xs text-gray-400">
                                                            {combo.size}
                                                        </p>
                                                    )}

                                                </div>

                                                {/* RIGHT SIDE */}

                                                <div className="flex items-center gap-2">

                                                    <div className="flex items-center gap-2">

                                                        {/* MINUS */}

                                                        {rule.allowCustomSelection && quantity > 0 && (

                                                            <button
                                                                type="button"
                                                                onClick={() => {

                                                                    updateProductQuantity(
                                                                        rule,
                                                                        product._id,
                                                                        'remove'
                                                                    )
                                                                }}
                                                                className="w-6 h-6 rounded-full border border-orange-200 bg-orange-50 text-[#F97316] flex items-center justify-center text-sm transition"
                                                            >
                                                                −
                                                            </button>
                                                        )}

                                                        {/* QUANTITY */}

                                                        {quantity > 0 && (

                                                            <span className="min-w-4 text-center text-sm font-semibold text-[#F97316]">
                                                                {quantity}
                                                            </span>
                                                        )}

                                                        {/* PLUS */}

                                                        {rule.allowCustomSelection && (

                                                            <button
                                                                type="button"
                                                                onClick={() => {

                                                                    updateProductQuantity(
                                                                        rule,
                                                                        product._id,
                                                                        'add'
                                                                    )
                                                                }}
                                                                disabled={
                                                                    getRuleTotalSelected(rule._id)
                                                                    >=
                                                                    rule.quantity
                                                                }
                                                                className={`w-6 h-6 rounded-full border flex items-center justify-center text-sm transition
                                                                ${getRuleTotalSelected(rule._id)
                                                                        >=
                                                                        rule.quantity
                                                                        ? 'border-gray-200 text-gray-300 bg-gray-50'
                                                                        : 'border-orange-200 bg-orange-50 text-[#F97316]'
                                                                    }`}
                                                            >
                                                                +
                                                            </button>
                                                        )}

                                                    </div>

                                                </div>

                                            </div>
                                        )
                                    })}

                                </div>
                            )}

                    </div>
                ))}

            </div>

            {/* ADD TO CART */}

            <div className="fixed bottom-6 left-0 right-0 px-4 z-50">

                <div className="max-w-md mx-auto">

                    <button
                        onClick={handleAddToCart}
                        disabled={
                            !isValid()
                            || addingToCart
                        }
                        className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl shadow-lg transition-colors
                        ${isValid()
                                ? 'bg-[#F97316] text-white'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >

                        <div className="flex items-center gap-2">

                            <ShoppingCart size={20} />

                            <span className="font-semibold text-sm">

                                {addingToCart
                                    ? 'Adding...'
                                    : 'Add to Cart'}

                            </span>

                        </div>

                        <span className="font-semibold text-sm">
                            ₹{combo.price}
                        </span>

                    </button>

                    {!isValid() && (

                        <p className="text-center text-xs text-gray-400 mt-2">
                            Complete all selections to continue
                        </p>
                    )}

                </div>

            </div>

        </div>
    )
}