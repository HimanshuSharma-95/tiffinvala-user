'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ShoppingCart, Plus, Minus, Calendar, PackageX, MapPin, ChevronRight, X } from 'lucide-react'
import {
    getNextDeliveryDate,
    getProductsByArea,
    getCombosByArea,
    addToCart,
    removeFromCart,
    viewCart,
} from '@/services/menuService'
import { useCartStore } from '@/store/cartStore'
import {
    Product,
    Combo,
    DeliveryDate,
    AddToCartPayload,
    CartItemResponse,
    ViewCartItem,
} from '@/types/menu'
import Loading from '@/components/general/Loading'
import ProtectedRoute from '@/components/ProtectedRoutes'

type Area = 'seattle' | 'bay_area'
type Tab = 'items' | 'packages'
type View = 'area-select' | 'tab-select' | 'items' | 'packages'

interface CategoryGroup {
    category: string
    products: Product[]
}


const AREAS: { key: Area; label: string }[] = [
    { key: 'seattle', label: 'Seattle' },
    { key: 'bay_area', label: 'Bay Area' },
]

function SizePicker({
    product,
    title = 'Choose size',
    onSelect,
    onClose,
}: {
    product: Product
    title?: string
    onSelect: (size: string) => void
    onClose: () => void
}) {
    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center px-6"
                onClick={onClose}>
                {/* Modal */}
                <div
                    className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{title}</p>
                            {/* <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Choose size</p> */}
                            <p className="text-base font-bold text-[#1E2A3A]">{product.name}</p>
                        </div>
                        <button onClick={onClose}
                            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 ml-3">
                            <X size={13} />
                        </button>
                    </div>

                    {/* Variants */}
                    <div className="space-y-2">
                        {product.variants.map(v => (
                            <button
                                key={v.size}
                                onClick={() => onSelect(v.size)}
                                className="w-full flex items-center justify-between bg-[#F0F5FA] hover:bg-orange-50 hover:border-[#F97316] border-2 border-transparent rounded-2xl px-4 py-3.5 transition-all"
                            >
                                <span className="text-sm font-semibold text-[#1E2A3A] capitalize">
                                    {v.size === '16oz' ? 'Half · 16oz'
                                        : v.size === '32oz' ? 'Full · 32oz'
                                            : v.size === 'half' ? 'Half'
                                                : v.size === 'full' ? 'Full'
                                                    : v.size}
                                </span>
                                <span className="text-sm font-bold text-[#F97316]">${v.price}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

function MenuPageContent() {

    const router = useRouter()
    const {
        getTotalQuantity,
        count,
        setItemsFromCart
    } = useCartStore()

    const [view, setView] = useState<View>('area-select')
    const [selectedArea, setSelectedArea] = useState<Area | null>(null)
    const [deliveryDate, setDeliveryDate] = useState<DeliveryDate | null>(null)
    const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([])
    const [combos, setCombos] = useState<Combo[]>([])
    const [pageLoading, setPageLoading] = useState(true)
    const [contentLoading, setContentLoading] = useState(false)
    const [loadingItems, setLoadingItems] = useState<string[]>([])
    const [removePicker, setRemovePicker] = useState<Product | null>(null)
    // Size picker state
    const [sizePicker, setSizePicker] = useState<Product | null>(null)

    const hasFetched = useRef(false)

    const getLoadingKey = (
        productId: string,
        size?: string
    ) => `${productId}-${size || 'default'}`

    const startLoading = (
        productId: string,
        size?: string
    ) => {
        const key = getLoadingKey(productId, size)

        setLoadingItems(prev => {
            if (prev.includes(key)) return prev
            return [...prev, key]
        })
    }

    const stopLoading = (
        productId: string,
        size?: string
    ) => {
        const key = getLoadingKey(productId, size)

        setLoadingItems(prev =>
            prev.filter(i => i !== key)
        )
    }

    const isItemLoading = (
        productId: string,
        size?: string
    ) => {
        return loadingItems.includes(
            getLoadingKey(productId, size)
        )
    }

    // persist area to localStorage
    const saveArea = (area: Area) => {
        if (typeof window !== 'undefined') localStorage.setItem('menu_area', area)
    }
    const getSavedArea = (): Area | null => {
        if (typeof window === 'undefined') return null
        return localStorage.getItem('menu_area') as Area | null
    }

    useEffect(() => {
        if (hasFetched.current) return
        hasFetched.current = true
        initPage()
    }, [])

    useEffect(() => {

        window.history.scrollRestoration = 'manual'

        window.scrollTo({
            top: 0,
            behavior: 'instant' as ScrollBehavior,
        })

    }, [])

    const initPage = async () => {
        setPageLoading(true)

        // restore area from last session
        const savedArea = getSavedArea()
        if (savedArea) {
            setSelectedArea(savedArea)
            setView('tab-select')   // skip area select screen
        }

        try {
            const [deliveryRes, cartRes] = await Promise.allSettled([
                getNextDeliveryDate(),
                viewCart(),
            ])
            if (deliveryRes.status === 'fulfilled') setDeliveryDate(deliveryRes.value.data)
            if (cartRes.status === 'fulfilled') {
                const cartItems = cartRes.value.data.items as ViewCartItem[]
                setItemsFromCart(
                    cartItems.map((i: any) => ({

                        itemId: i.itemId,

                        productId:
                            i.productId ||
                            i.comboId ||
                            '',

                        name: i.name,

                        price:
                            i.variant?.price ||
                            i.selectedVariant?.price ||
                            i.price ||
                            i.basePrice ||
                            0,

                        size:
                            i.variant?.size ||
                            i.selectedVariant?.size ||
                            i.size ||
                            '16oz',

                        type: i.type,

                        quantity: i.quantity,
                    }))
                )
            }
        } catch {
            toast.error('Failed to load page')
        } finally {
            setPageLoading(false)
        }
    }

    const handleAreaSelect = (area: Area) => {
        setSelectedArea(area)
        saveArea(area)
        setView('tab-select')
    }

    const handleTabSelect = async (tab: Tab) => {
        if (!selectedArea) return
        setContentLoading(true)
        setView(tab === 'items' ? 'items' : 'packages')
        try {
            if (tab === 'items') {
                const res = await getProductsByArea(selectedArea)
                setCategoryGroups(res.data.list)
            } else {
                const res = await getCombosByArea(selectedArea)
                setCombos(res.data)
            }
        } catch { toast.error('Failed to load menu') }
        finally { setContentLoading(false) }
    }

    const allProducts = categoryGroups.flatMap(g => g.products)


    const syncCartFromResponse = (
        cartItems: any[]
    ) => {

        const mapped = cartItems.map((entry) => {

            const productId =
                entry.productId ||
                entry.comboId ||
                ''

            const product = allProducts.find(
                p => p._id === productId
            )

            const combo = combos.find(
                c => c._id === productId
            )

            // IMPORTANT FIX
            const size =
                entry.variant?.size ||
                entry.selectedVariant?.size ||
                combo?.size ||
                '16oz'

            const price =
                entry.variant?.price ||
                entry.selectedVariant?.price ||
                product?.variants.find(
                    v => v.size === size
                )?.price ||
                combo?.price ||
                0

            return {
                itemId: entry.itemId,

                productId,

                name:
                    entry.name ||
                    product?.name ||
                    combo?.name ||
                    '',

                price,

                size,

                type: entry.type,

                quantity: entry.quantity,
            }
        })

        setItemsFromCart(mapped)
    }


    const handleAddWithSize = async (
        product: Product,
        size: string
    ) => {

        const variant =
            product.variants.find(v => v.size === size) ||
            product.variants[0]

        const loadingKey = variant.size

        if (isItemLoading(product._id, loadingKey)) return

        setSizePicker(null)

        startLoading(product._id, loadingKey)

        try {

            const payload: AddToCartPayload = {
                items: [
                    {
                        type: 'product',
                        productId: product._id,
                        quantity: 1,
                        size: variant.size,
                    },
                ],
            }

            const response = await addToCart(payload)

            syncCartFromResponse(response.data.items)

        } catch (error: any) {

            toast.error(
                error.response?.data?.message ||
                'Failed to add'
            )

        } finally {

            stopLoading(product._id, loadingKey)
        }
    }


    const handleAdd = (product: Product) => {
        // Multiple variants → show size picker
        if (product.variants.length > 1) {
            setSizePicker(product)
            return
        }
        // Single variant → add directly
        handleAddWithSize(product, product.variants[0].size)
    }



    const handleRemoveWithSize = async (
        product: Product,
        size: string
    ) => {

        const allItems = useCartStore.getState().items

        const entry = allItems.find(
            i =>
                i.productId === product._id &&
                i.size === size
        )

        if (!entry) {
            setRemovePicker(null)
            return
        }

        if (isItemLoading(product._id, size)) return

        startLoading(product._id, size)

        try {

            setRemovePicker(null)

            const response = await removeFromCart(
                entry.itemId
            )

            syncCartFromResponse(response.data.items)

        } catch (error: any) {

            toast.error(
                error.response?.data?.message ||
                'Failed to remove'
            )

        } finally {

            stopLoading(product._id, size)
        }
    }


    const handleRemove = (product: Product) => {
        const allItems = useCartStore.getState().items
        const productItems = allItems.filter(i => i.productId === product._id)

        if (productItems.length > 1) {
            // multiple sizes in cart — show picker to choose which to remove
            setRemovePicker(product)
            return
        }

        // single entry
        const entry = productItems[0]
        if (!entry) return
        handleRemoveWithSize(product, entry.size)
    }

    const CartBar = () => count() > 0 ? (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-30">
            <div className="max-w-2xl mx-auto">
                <button onClick={() => router.push('/profile/cart')}
                    className="w-full flex items-center justify-between bg-[#F97316] text-white px-6 py-4 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-2">
                        <ShoppingCart size={20} />
                        <span className="font-semibold text-sm">{count()} items</span>
                    </div>
                    <span className="font-semibold text-sm">View Cart →</span>
                </button>
            </div>
        </div>
    ) : null

    // ── PAGE LOADING
    if (pageLoading) return (
        <div className="min-h-screen bg-white px-4 py-6 space-y-4 max-w-2xl mx-auto">
            <div className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-52 bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
        </div>
    )

    // ── NOT ACCEPTING ORDERS
    if (deliveryDate && !deliveryDate.acceptingOrders) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 gap-4">
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                <PackageX size={36} className="text-[#F97316]" />
            </div>
            <h2 className="text-xl font-bold text-[#1E2A3A] text-center">Not Accepting Orders</h2>
            <p className="text-sm text-gray-400 text-center">We are not accepting orders right now. Please check back later.</p>
            <button onClick={() => router.push('/')} className="mt-2 bg-[#F97316] text-white px-10 py-3 rounded-xl font-semibold">Go Home</button>
        </div>
    )

    // ── AREA SELECT
    if (view === 'area-select') return (
        <div className="min-h-screen bg-white">
            <div className="max-w-2xl mx-auto px-4">
                {deliveryDate && (
                    <div className="mt-4 bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                        <Calendar size={20} className="text-[#F97316] shrink-0" />
                        <div>
                            <p className="text-xs text-gray-400">Next Delivery</p>
                            <p className="text-sm font-semibold text-[#1E2A3A]">{deliveryDate.formatted}</p>
                        </div>
                    </div>
                )}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin size={18} className="text-[#F97316]" />
                        <h2 className="text-md font-bold text-[#1E2A3A]">Select Your Area</h2>
                    </div>
                    <p className="text-xs text-gray-400 mb-6 ml-6">Choose which area you want to order from</p>
                    <div className="space-y-3">
                        {AREAS.map(area => (
                            <button key={area.key} onClick={() => handleAreaSelect(area.key)}
                                className="w-full bg-gray-50 rounded-2xl px-5 py-4 flex items-center justify-between hover:bg-orange-50 hover:border-orange-200 border-2 border-transparent transition-all">
                                <span className="text-base font-semibold text-[#1E2A3A]">{area.label}</span>
                                <ChevronRight size={18} className="text-gray-400" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

    // ── TAB SELECT
    if (view === 'tab-select') return (
        <div className="min-h-screen bg-white">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex items-center gap-3 py-4">
                    <button onClick={() => setView('area-select')} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <ChevronRight size={16} className="rotate-180" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-[#1E2A3A]">{AREAS.find(a => a.key === selectedArea)?.label} Menu</h1>
                        <p className="text-xs text-gray-400">What would you like?</p>
                    </div>
                </div>
                <div className="mt-4 space-y-3">
                    <button onClick={() => handleTabSelect('items')}
                        className="w-full bg-gray-50 rounded-2xl px-5 py-4 flex items-center justify-between hover:bg-orange-50 border-2 border-transparent hover:border-orange-200 transition-all">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🍛</span>
                            <p className="text-sm font-semibold text-[#1E2A3A]">Individual Items</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                    </button>
                    <button onClick={() => handleTabSelect('packages')}
                        className="w-full bg-gray-50 rounded-2xl px-5 py-4 flex items-center justify-between hover:bg-orange-50 border-2 border-transparent hover:border-orange-200 transition-all">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🍱</span>
                            <div className="text-left">
                                <p className="text-sm font-semibold text-[#1E2A3A]">Combo Packages</p>
                                <p className="text-xs text-gray-400">Full meal deals with choices</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                    </button>
                </div>
            </div>
        </div>
    )

    // ── ITEMS VIEW
    if (view === 'items') return (
        <div className="min-h-screen bg-white pb-32">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex items-center gap-3 py-4">
                    <button onClick={() => setView('tab-select')} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <ChevronRight size={16} className="rotate-180" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-[#1E2A3A]">{AREAS.find(a => a.key === selectedArea)?.label} Items</h1>
                        {deliveryDate && <p className="text-xs text-gray-400">Delivery: {deliveryDate.formatted}</p>}
                    </div>
                </div>

                {contentLoading ? (
                    <div className="space-y-6">
                        {[1, 2].map(i => (
                            <div key={i}>
                                <div className="h-5 w-24 bg-gray-100 rounded-full animate-pulse mb-3" />
                                <div className="grid grid-cols-2 gap-4">
                                    {[1, 2].map(j => <div key={j} className="h-52 bg-gray-100 rounded-2xl animate-pulse" />)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {categoryGroups.map(group => (
                            <div key={group.category}>
                                <h2 className="text-sm font-bold text-[#1E2A3A] capitalize mb-3">
                                    {group.category.replace(/_/g, ' ')}
                                    <span className="text-gray-400 font-normal ml-1">({group.products.length})</span>
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {group.products.map(product => {
                                        const qty = getTotalQuantity(product._id)
                                        const hasLoading =
                                            loadingItems.some(i =>
                                                i.startsWith(product._id)
                                            )
                                        return (
                                            <div
                                                key={product._id}
                                                className="border-gray-100 bg-gray-100 rounded-2xl overflow-hidden flex flex-col"
                                            >

                                                {/* Image Wrapper */}
                                                <div className="p-2.5 pb-0">
                                                    <div className="relative w-full h-36 rounded-2xl overflow-hidden">

                                                        <img
                                                            src={product.image?.trim() || '/images/defFoodImage.webp'}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src =
                                                                    '/images/defFoodImage.webp'
                                                            }}
                                                        />

                                                        {/* <span
                                                            className={`absolute top-2 left-2 w-3 h-3 rounded-full border-2
                    ${product.food_class === 'chicken' ||
                                                                    product.food_class === 'mutton'
                                                                    ? 'border-red-500 bg-red-500'
                                                                    : 'border-green-500 bg-green-500'
                                                                }`}
                                                        /> */}

                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-2.5 flex flex-col gap-1.5 flex-1">

                                                    <p className="text-xs font-semibold text-[#1E2A3A] line-clamp-2 leading-tight">
                                                        {product.name}
                                                    </p>

                                                    <p className="text-xs text-[#F97316] font-semibold">
                                                        ${product.variants[0].price}

                                                        {product.variants.length > 1 && (
                                                            <span className="text-gray-400 font-normal">
                                                                {' '}· {product.variants.length} sizes
                                                            </span>
                                                        )}
                                                    </p>

                                                    <div className="flex items-center justify-between bg-white rounded-full px-2 py-1 mt-0.5">

                                                        <button
                                                            onClick={() => handleRemove(product)}
                                                            disabled={qty === 0 || hasLoading}
                                                            className="w-6 h-6 flex items-center justify-center rounded-full disabled:opacity-30 text-[#F97316]"
                                                        >
                                                            <Minus size={13} />
                                                        </button>

                                                        <span className="text-sm font-bold text-[#1E2A3A] min-w-4 text-center">
                                                            {hasLoading ? <Loading size={14} /> : qty}
                                                        </span>

                                                        <button
                                                            onClick={() => handleAdd(product)}
                                                            disabled={hasLoading}
                                                            className="w-6 h-6 flex items-center justify-center rounded-full disabled:opacity-30 text-[#F97316]"
                                                        >
                                                            <Plus size={13} />
                                                        </button>

                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CartBar />

            {/* Size picker sheet */}
            {sizePicker && (
                <SizePicker
                    product={sizePicker}
                    title="Add which size?"
                    onSelect={(size) => handleAddWithSize(sizePicker, size)}
                    onClose={() => setSizePicker(null)}
                />
            )}
            {removePicker && (
                <SizePicker
                    product={removePicker}
                    title="Remove which size?"
                    onSelect={(size) => handleRemoveWithSize(removePicker, size)}
                    onClose={() => setRemovePicker(null)}
                />
            )}

        </div>
    )

    // ── PACKAGES VIEW
    return (
        <div className="min-h-screen bg-white pb-32">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex items-center gap-3 py-4">
                    <button onClick={() => setView('tab-select')} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <ChevronRight size={16} className="rotate-180" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-[#1E2A3A]">{AREAS.find(a => a.key === selectedArea)?.label} Packages</h1>
                        {deliveryDate && <p className="text-xs text-gray-400">Delivery: {deliveryDate.formatted}</p>}
                    </div>
                </div>

                {contentLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {combos.map(combo => (

                            <div
                                key={combo._id}
                                onClick={() =>
                                    router.push(
                                        `/menu/combo/${combo._id}?area=${selectedArea}`
                                    )
                                }
                                className="border-gray-100 bg-gray-100 rounded-3xl overflow-hidden cursor-pointer border hover:border-orange-200 hover:bg-orange-50/40 transition-all duration-300"
                            >

                                <div className="flex p-3 gap-4 items-stretch">

                                    {/* Left Side */}
                                    <div className="w-32 shrink-0 flex flex-col">

                                        {/* Image */}
                                        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-200">

                                            <img
                                                src={
                                                    combo.image?.trim() ||
                                                    '/images/defFoodImage.webp'
                                                }
                                                alt={combo.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (
                                                        e.target as HTMLImageElement
                                                    ).src =
                                                        '/images/defFoodImage.webp'
                                                }}
                                            />

                                        </div>

                                        {/* Name */}
                                        <h3 className="text-sm font-bold text-[#1E2A3A] mt-2 leading-tight line-clamp-2">
                                            {combo.name}
                                        </h3>

                                        {/* Price */}
                                        <p className="text-lg font-extrabold text-[#F97316] mt-1">
                                            ${combo.price}
                                        </p>

                                    </div>

                                    {/* Right Side */}
                                    <div className="flex-1 flex flex-col justify-between min-h-full">

                                        {/* Included Items */}
                                        <div>

                                            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                                Included Items
                                            </p>

                                            <div className="space-y-1">

                                                {combo.rules.map(rule => (

                                                    <div
                                                        key={rule._id}
                                                        className="text-[13px] text-[#1E2A3A] leading-snug"
                                                    >

                                                        <span className="font-bold text-[#F97316]">
                                                            {rule.quantity} ×
                                                        </span>{' '}

                                                        <span className="font-medium">
                                                            {rule.title ||
                                                                rule.category
                                                                    .join(', ')
                                                                    .replace(/_/g, ' ')}
                                                        </span>

                                                    </div>

                                                ))}

                                            </div>

                                        </div>

                                        {/* Bottom */}
                                        <div className="flex justify-end mt-3">

                                            <button
                                                className="text-xs font-semibold border border-orange-500 text-[#F97316] bg-white hover:bg-orange-200 transition-colors px-3 py-1.5 rounded-full"
                                            >
                                                Customize Combo
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}
                    </div>
                )}
            </div>
            <CartBar />
        </div>
    )
}



export default function MenuPage() {
    return (
        <ProtectedRoute>
            <MenuPageContent />
        </ProtectedRoute>
    )
}