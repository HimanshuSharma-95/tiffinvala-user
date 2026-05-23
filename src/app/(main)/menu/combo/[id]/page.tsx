'use client'

import { useState, useEffect, useRef } from 'react'
import {
    useRouter,
    useParams,
    useSearchParams
} from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Check, ShoppingCart } from 'lucide-react'
import { getSingleCombo, addToCart, viewCart } from '@/services/menuService'
import { useCartStore } from '@/store/cartStore'
import { Combo, ComboRule, AddToCartPayload, CartItemResponse } from '@/types/menu'


type Area = 'seattle' | 'bay_area'

export default function ComboDetailPage() {
    const router = useRouter()
    const params = useParams()
    const comboId = params.id as string
    const searchParams = useSearchParams()


    const area =
        (searchParams.get('area') as Area) ||
        'seattle'

    // const { upsertItem, setItemsFromCart } = useCartStore()

    const [combo, setCombo] = useState<Combo | null>(null)
    const [loading, setLoading] = useState(true)
    const [addingToCart, setAddingToCart] = useState(false)



    // selections state — keyed by ruleId
    const [selections, setSelections] = useState<Record<string, string[]>>({})
    const isFetched = useRef(false)

    useEffect(() => {
        if (!isFetched.current) {
            fetchCombo()
            isFetched.current = true
        }
    }, [comboId])

    useEffect(() => {

        if (!combo) return

        const autoSelections: Record<string, string[]> = {}

        combo.rules.forEach(rule => {

            // auto select non-custom rules
            if (
                !rule.allowCustomSelection &&
                !rule.isFixed &&
                rule.products?.length
            ) {

                autoSelections[rule._id] =
                    rule.products
                        .slice(0, rule.quantity)
                        .map(p => p._id)
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
            const response = await getSingleCombo(comboId, area)
            setCombo(response.data)
        } catch {
            toast.error('Failed to load combo')
            router.back()
        } finally {
            setLoading(false)
        }
    }

    // toggle product selection for a rule
    const toggleSelection = (rule: ComboRule, productId: string) => {
        const current = selections[rule._id] || []
        const isSelected = current.includes(productId)



        if (isSelected) {
            // deselect
            setSelections(prev => ({
                ...prev,
                [rule._id]: current.filter(id => id !== productId)
            }))
        } else {
            if (current.length >= rule.quantity) {
                // already at max — replace oldest selection
                setSelections(prev => ({
                    ...prev,
                    [rule._id]: [...current.slice(1), productId]
                }))
            } else {
                setSelections(prev => ({
                    ...prev,
                    [rule._id]: [...current, productId]
                }))
            }
        }
    }


    // check if all required rules are satisfied
    const isValid = () => {
        if (!combo) return false
        return combo.rules.every(rule => {
            if (rule.isFixed || !rule.allowCustomSelection) return true // fixed rules don't need selection
            if (rule.isOptional) return true // optional rules can be skipped
            const selected = selections[rule._id] || []
            return selected.length === rule.quantity
        })
    }

    const handleAddToCart = async () => {
        if (!combo || !isValid()) return
        setAddingToCart(true)
        try {
            // build selections payload
            const selectionPayload = combo.rules
                .filter(rule => !rule.isFixed)
                .map(rule => ({
                    ruleId: rule._id,

                    products: (selections[rule._id] || []).map(productId => ({

                        productId,

                        quantity: rule.allowCustomSelection
                            ? 1
                            : rule.quantity

                    }))

                }))

            const payload: AddToCartPayload = {
                items: [{
                    type: 'combo',
                    comboId: combo._id,
                    quantity: 1,
                    selections: selectionPayload,
                }]
            }

            const response = await addToCart(payload)
            const cartItems: CartItemResponse[] = response.data.items

            // find the combo entry
            // const entry = cartItems.find(i => i.comboId === combo._id)

            // if (entry) {
            //     upsertItem({
            //         itemId: entry.itemId,
            //         productId: combo._id,
            //         name: combo.name,
            //         price: combo.price,
            //         size: combo.size,
            //         type: 'combo',
            //         quantity: entry.quantity,
            //     })
            // }

            toast.success(`${combo.name} added to cart!`)
            router.push('/profile/cart')

        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add to cart')
        } finally {
            setAddingToCart(false)
        }
    }

    // ── LOADING
    if (loading) {
        return (
            <div className="min-h-screen  max-w-2xl m-auto bg-white px-4 py-6 space-y-4">
                <div className="h-8 w-32 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-6 w-48 bg-gray-100 rounded-full animate-pulse" />
                <div className="space-y-3 mt-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    if (!combo) return null

    // count how many rules need selection
    const requiredRules = combo.rules.filter(
        r => !r.isFixed && r.allowCustomSelection && !r.isOptional
    )
    const completedRules = requiredRules.filter(
        r => (selections[r._id] || []).length === r.quantity
    )

    return (
        <div className="min-h-screen  max-w-2xl m-auto bg-white pb-32">

            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-4">
                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                >
                    <ArrowLeft size={16} />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-[#1E2A3A]">{combo.name}</h1>
                    {combo.description && (
                        <p className="text-xs text-gray-400">{combo.description}</p>
                    )}
                </div>
            </div>

            {/* Price + Size */}
            <div className="mx-4 bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400">Package Price</p>
                    <p className="text-lg font-bold text-[#F97316]">${combo.price}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400">Size</p>
                    <p className="text-sm font-semibold text-[#1E2A3A]">{combo.size}</p>
                </div>
            </div>

            {/* Progress */}
            {requiredRules.length > 0 && (
                <div className="mx-4 mt-3 flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div
                            className="bg-[#F97316] h-1.5 rounded-full transition-all"
                            style={{ width: `${(completedRules.length / requiredRules.length) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs text-gray-400">
                        {completedRules.length}/{requiredRules.length} done
                    </span>
                </div>
            )}

            {/* Rules */}
            <div className="px-4 mt-4 space-y-5">
                {combo.rules.map(rule => (
                    <div key={rule._id}>

                        {/* Rule Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="text-sm font-bold text-[#1E2A3A]">
                                    {rule.title}
                                </h3>
                                <p className="text-xs text-gray-400">
                                    {rule.isFixed
                                        ? `Included: ${rule.quantity}`
                                        : `${rule.label}`}
                                    {rule.isOptional && ' (optional)'}
                                </p>
                            </div>

                            {/* completion badge */}
                            {!rule.isFixed && rule.allowCustomSelection && (
                                <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full
                                    ${(selections[rule._id] || []).length === rule.quantity
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-gray-100 text-gray-400'}`}
                                >
                                    {(selections[rule._id] || []).length === rule.quantity && (
                                        <Check size={10} />
                                    )}
                                    {(selections[rule._id] || []).length}/{rule.quantity}
                                </div>
                            )}
                        </div>

                        {/* Fixed Rule — just show info */}
                        {rule.isFixed && (
                            <div className="bg-gray-50 rounded-xl px-4 py-3">
                                <p className="text-xs text-gray-500">
                                    {rule.quantity}x {rule.title} included automatically
                                </p>
                            </div>
                        )}

                        {/* Selectable Products */}
                        {!rule.isFixed && rule.products && rule.products.length > 0 && (
                            <div className="space-y-2">
                                {rule.products.map(product => {
                                    const isSelected = (selections[rule._id] || []).includes(product._id)

                                    return (
                                        <button
                                            key={product._id}
                                            onClick={() => {
                                                if (rule.allowCustomSelection) {
                                                    toggleSelection(rule, product._id)
                                                }
                                            }}

                                            // className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all
                                            //     ${isSelected
                                            //         ? 'border-[#F97316] bg-orange-50'
                                            //         : 'border-gray-200 bg-gray-50'}`}

                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all
    ${isSelected
                                                    ? 'border-[#F97316] bg-orange-50'
                                                    : 'border-gray-200 bg-gray-50'}
    ${!rule.allowCustomSelection ? 'cursor-default' : ''}
`}

                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-left">
                                                    <p className="text-sm font-medium text-[#1E2A3A]">
                                                        {product.name}
                                                    </p>

                                                    {product.variants[0].size !== 'default' && (
                                                        <p className="text-xs text-gray-400">
                                                            {combo.size}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Checkbox */}
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                                ${isSelected
                                                    ? 'border-[#F97316] bg-[#F97316]'
                                                    : 'border-gray-300'}`}
                                            >
                                                {isSelected && <Check size={10} className="text-white" />}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                    </div>
                ))}
            </div>

            {/* Sticky Add to Cart */}
            <div className="fixed bottom-6 left-0 right-0 px-4 z-50">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={handleAddToCart}
                        disabled={!isValid() || addingToCart}
                        className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl shadow-lg transition-colors
                            ${isValid()
                                ? 'bg-[#F97316] text-white'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                        <div className="flex items-center gap-2">
                            <ShoppingCart size={20} />
                            <span className="font-semibold text-sm">
                                {addingToCart ? 'Adding...' : 'Add to Cart'}
                            </span>
                        </div>
                        <span className="font-semibold text-sm">
                            ₹{combo.price}
                        </span>
                    </button>

                    {/* hint when disabled */}
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