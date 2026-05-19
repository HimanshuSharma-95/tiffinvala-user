export interface OrdersResponse {
    statuscode: number
    success: boolean
    message: string
    data: OrdersData
}

export interface OrdersData {
    filters: OrderFilters
    totalOrders: number
    orders: Order[]
}

export interface OrderFilters {
    status: string | null
    paymentStatus: string | null
    paymentMethod: string | null
    isorderdelivered: string | null
}

export interface Order {
    orderId: string

    user: OrderUser

    status:
    | 'pending'
    | 'confirmed'
    | 'completed'
    | 'cancelled'

    totalAmount: number

    payment: PaymentDetails

    deliveryDetails: DeliveryDetails

    deliveryDate: string

    deliveredAt: string | null

    isorderdelivered: boolean

    paymentRequested: boolean

    itemCount: number

    items: OrderItem[]

    placedAt: string
}

export interface OrderUser {
    userId: string
    username: string
    full_name: string
    email: string
}

export interface PaymentDetails {
    method: string
    status: string
}

export interface DeliveryDetails {
    addressId: string

    addressLine1: string

    addressLine2: string

    city: string

    state: string

    zipCode: string

    country: string

    location: DeliveryLocation

    phone: string
}

export interface DeliveryLocation {
    lat: number
    lng: number
}

export interface OrderItem {
    productId?: string | null

    comboId?: string | null

    name: string

    quantity: number

    type: 'product' | 'combo'

    variant: OrderVariant

    subtotal: number

    selections?: ComboSelection[]
}

export interface OrderVariant {
    size: string
    price: number
}

export interface ComboSelection {
    ruleId: string

    products: ComboSelectionProduct[]
}

export interface ComboSelectionProduct {
    productId: string

    name: string

    category: string

    quantity: number
}