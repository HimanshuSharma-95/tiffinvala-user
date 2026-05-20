import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    itemId: string
    productId: string
    name: string
    price: number
    size: string
    type: 'product' | 'combo'
    quantity: number
}

interface CartStore {
    items: CartItem[]

    setItemsFromCart: (items: CartItem[]) => void

    getQuantity: (productId: string, size?: string) => number

    getTotalQuantity: (productId: string) => number

    getItemByVariant: (
        productId: string,
        size: string
    ) => CartItem | undefined

    removeByItemId: (itemId: string) => void

    clearCart: () => void

    total: () => number

    count: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            setItemsFromCart: (items) => {
                set({ items })
            },

            getQuantity: (productId, size) => {
                return get().items
                    .filter(i =>
                        i.productId === productId &&
                        (!size || i.size === size)
                    )
                    .reduce((sum, i) => sum + i.quantity, 0)
            },

            getTotalQuantity: (productId) => {
                return get().items
                    .filter(i => i.productId === productId)
                    .reduce((sum, i) => sum + i.quantity, 0)
            },

            getItemByVariant: (productId, size) => {
                return get().items.find(
                    i =>
                        i.productId === productId &&
                        i.size === size
                )
            },

            removeByItemId: (itemId) => {
                set({
                    items: get().items.filter(
                        i => i.itemId !== itemId
                    )
                })
            },

            clearCart: () => set({ items: [] }),

            total: () =>
                get().items.reduce(
                    (sum, i) => sum + i.price * i.quantity,
                    0
                ),

            count: () =>
                get().items.reduce(
                    (sum, i) => sum + i.quantity,
                    0
                ),
        }),
        {
            name: 'cart-storage',
        }
    )
)