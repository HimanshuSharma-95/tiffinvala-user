// import axios from 'axios'

// // console.log("API KEY:", process.env.NEXT_PUBLIC_API_KEY)
// // console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)
// // console.log("Google API:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)

// const api = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_URL,
//     headers: {
//         'Content-Type': 'application/json',
//         'api_key': process.env.NEXT_PUBLIC_API_KEY
//     },
//     withCredentials: true,
// })

// // Handle global errors
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         const status = error.response?.status

//         if (status === 500) {
//             console.error('Server error, please try again later')
//         }

//         return Promise.reject(error)
//     }
// )

// export default api









import axios from 'axios'
import { handleLogout } from '@/utils/auth'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
        api_key: process.env.NEXT_PUBLIC_API_KEY
    },
    withCredentials: true,
})

let isLoggingOut = false

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const status = error.response?.status
        const requestUrl = error.config?.url || ''

        if (status === 401 && !isLoggingOut) {
            const ignoredRoutes = [
                '/users/login',
                '/users/startRegistration',
                '/users/verifyEmail_registeruser',
                '/users/forgotpassword',
                '/users/updateemail',
                '/users/verifyemail',
                '/users/logout',
            ]

            const shouldIgnore = ignoredRoutes.some(route =>
                requestUrl.includes(route)
            )

            if (!shouldIgnore) {
                isLoggingOut = true

                try {
                    // false = don't call backend logout again
                    await handleLogout(false, true)
                } finally {
                    isLoggingOut = false
                }
            }
        }

        if (status === 500) {
            console.error('Server error, please try again later')
        }

        return Promise.reject(error)
    }
)

export default api