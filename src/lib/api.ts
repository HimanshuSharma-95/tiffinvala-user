import axios from 'axios'

console.log("API KEY:", process.env.NEXT_PUBLIC_API_KEY)
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'api_key': process.env.NEXT_PUBLIC_API_KEY
    },
    withCredentials: true,
})

// Handle global errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status

        if (status === 500) {
            console.error('Server error, please try again later')
        }

        return Promise.reject(error)
    }
)

export default api