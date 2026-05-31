// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'
// import { Address, User } from '@/types/auth'

// type UserUpdater = User | null | ((currentUser: User | null) => User | null)

// interface AuthStore {
//     user: User | null
//     pendingEmail: string | null

//     setUser: (nextUserOrUpdater: UserUpdater) => void
//     setAddresses: (updater: (currentAddresses: Address[]) => Address[]) => void
//     setPendingEmail: (email: string) => void
//     logout: () => void
//     isLoggedIn: () => boolean
// }

// export const useAuthStore = create<AuthStore>()(
//     persist(
//         (set, get) => ({
//             user: null,
//             pendingEmail: null,

//             // only save user data, cookie is handled by browser
//             setUser: (nextUserOrUpdater) =>
//                 set((state) => ({
//                     user:
//                         typeof nextUserOrUpdater === 'function'
//                             ? (nextUserOrUpdater as (currentUser: User | null) => User | null)(state.user)
//                             : nextUserOrUpdater,
//                 })),

//             setAddresses: (updater) =>
//                 set((state) => {
//                     if (!state.user) return { user: state.user }

//                     const prevAddresses = state.user.addresses || []
//                     const updatedAddresses = updater([...prevAddresses])

//                     return {
//                         user: {
//                             ...state.user,
//                             addresses: updatedAddresses,
//                         },
//                     }
//                 }),

//             setPendingEmail: (email) => set({ pendingEmail: email }),

//             logout: () => set({ user: null, pendingEmail: null }),

//             isLoggedIn: () => !!get().user,
//         }),
//         {
//             name: 'auth-storage',
//         }
//     )
// )



// src/store/authStore.ts — add hasHydrated flag
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Address, User } from '@/types/auth'

type UserUpdater = User | null | ((currentUser: User | null) => User | null)

interface AuthStore {
    user: User | null
    pendingEmail: string | null
    _hasHydrated: boolean

    setHasHydrated: (state: boolean) => void
    setUser: (nextUserOrUpdater: UserUpdater) => void
    setAddresses: (updater: (currentAddresses: Address[]) => Address[]) => void
    setPendingEmail: (email: string) => void
    logout: () => void
    isLoggedIn: () => boolean
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            pendingEmail: null,
            _hasHydrated: false,

            setHasHydrated: (state) => set({ _hasHydrated: state }),

            setUser: (nextUserOrUpdater) =>
                set((state) => ({
                    user:
                        typeof nextUserOrUpdater === 'function'
                            ? (nextUserOrUpdater as (currentUser: User | null) => User | null)(state.user)
                            : nextUserOrUpdater,
                })),

            setAddresses: (updater) =>
                set((state) => {
                    if (!state.user) return { user: state.user }
                    const prevAddresses = state.user.addresses || []
                    return {
                        user: {
                            ...state.user,
                            addresses: updater([...prevAddresses]),
                        },
                    }
                }),

            setPendingEmail: (email) => set({ pendingEmail: email }),

            logout: () => {
                set({ user: null, pendingEmail: null })
                localStorage.removeItem('auth-storage')
            },

            isLoggedIn: () => !!get().user,
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true)  // ← fires once localStorage is loaded
            },
        }
    )
)

