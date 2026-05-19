// export interface ProductVariant {
//     size: string
//     price: number
// }

// export interface Product {
//     _id: string
//     name: string
//     description: string
//     image: string
//     category: string
//     food_class: string
//     product_type: string
//     variants: ProductVariant[]
//     isAvailable: boolean
// }

// export interface ComboRule {
//     _id: string
//     title: string
//     label: string
//     category: string[]
//     quantity: number
//     isFixed: boolean
//     isOptional: boolean
//     allowCustomSelection: boolean
//     products?: {
//         _id: string
//         name: string
//         category: string
//         food_class: string
//         variants: ProductVariant[]
//     }[]
// }

// export interface Combo {
//     _id: string
//     name: string
//     description?: string
//     price: number
//     size: string
//     rules: ComboRule[]
//     isActive: boolean
//     image?: string
// }

// export interface DeliveryDate {
//     acceptingOrders: boolean
//     date: string
//     formatted: string
//     day: string
// }

// export interface CartItemPayload {
//     type: 'product' | 'combo'
//     productId?: string
//     comboId?: string
//     quantity: number
//     size?: string
//     selections?: {
//         ruleId: string
//         products: { productId: string; quantity: number }[]
//     }[]
// }

// export interface AddToCartPayload {
//     items: CartItemPayload[]
// }

// // shape of each item in addtocart / removefromcart response
// export interface CartItemResponse {
//     itemId: string
//     _id: string
//     type: 'product' | 'combo'
//     productId?: string
//     comboId?: string
//     quantity: number
//     selections: any[]
// }

// // shape of viewcart response items
// export interface ViewCartItem {
//     itemId: string
//     type: 'product' | 'combo'
//     productId?: string
//     comboId?: string
//     name: string
//     size?: string
//     price?: number
//     subtotal?: number
//     basePrice?: number
//     quantity: number
//     total: number
//     selections?: any[]
//     fixedItems?: { title: string; quantity: number }[]
// }

// export interface ViewCartResponse {
//     items: ViewCartItem[]
//     totalAmount: number
//     summary: Record<string, number>
// }








export interface ProductVariant {
    size: string
    price: number
}

export interface Product {
    _id: string
    name: string
    description: string
    image: string
    category: string
    food_class: string
    product_type: string
    variants: ProductVariant[]
    isAvailable: boolean
}

export interface ComboRule {
    _id: string
    title: string
    label: string
    category: string[]
    quantity: number
    isFixed: boolean
    isOptional: boolean
    allowCustomSelection: boolean

    products?: {
        _id: string
        name: string
        category: string
        food_class: string
        variants: ProductVariant[]
    }[]
}

export interface Combo {
    _id: string
    name: string
    description?: string
    price: number
    size: string
    rules: ComboRule[]
    isActive: boolean
    image?: string
}

export interface DeliveryDate {
    acceptingOrders: boolean
    date: string
    formatted: string
    day: string
}

export interface CartItemPayload {
    type: 'product' | 'combo'

    productId?: string

    comboId?: string

    quantity: number

    size?: string

    selections?: {
        ruleId: string

        products: {
            productId: string
            quantity: number
        }[]
    }[]
}

export interface AddToCartPayload {
    items: CartItemPayload[]
}

// ─────────────────────────────
// ADD / REMOVE CART RESPONSE
// ─────────────────────────────

export interface CartItemResponse {
    itemId: string

    _id: string

    type: 'product' | 'combo'

    productId?: string

    comboId?: string

    quantity: number

    selections?: ComboSelection[]
}

// ─────────────────────────────
// VIEW CART RESPONSE
// ─────────────────────────────

export interface ViewCartVariant {
    size: string
    price: number
}

export interface ComboSelectionProduct {
    productId: string
    name?: string
    quantity: number
}

export interface ComboSelection {
    ruleId: string

    products: ComboSelectionProduct[]
}

export interface ViewCartItem {
    itemId: string

    type: 'product' | 'combo'

    productId?: string

    comboId?: string

    name: string

    description?: string

    image?: string

    category?: string

    quantity: number

    variant?: ViewCartVariant

    subtotal: number

    selections?: ComboSelection[]

    // legacy support
    size?: string
    price?: number
    basePrice?: number
    total?: number
    fixedItems?: {
        title: string
        quantity: number
    }[]
}

export interface ViewCartResponse {
    cartId: string

    totalItems: number

    totalAmount: number

    items: ViewCartItem[]

    createdAt: string

    updatedAt: string

    summary?: Record<string, number>
}

export interface ViewCartApiResponse {
    statuscode: number

    success: boolean

    message: string

    data: ViewCartResponse
}