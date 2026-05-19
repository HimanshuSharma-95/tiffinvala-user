import api from '@/lib/api'
import { RegisterData, VerifyEmailData, LoginData, AuthData, User } from '@/types/auth'
import { ApiResponse } from '@/types/apiResponse'

export const startRegistration = async (data: RegisterData) => {
    const response = await api.post<ApiResponse<{}>>('/users/startRegistration', data)
    return response.data
}

export const verifyEmailAndRegister = async (data: VerifyEmailData) => {
    const response = await api.post<ApiResponse<AuthData>>('/users/verifyEmail_registeruser', data)
    return response.data
}

export const loginUser = async (data: LoginData) => {
    const response = await api.post<ApiResponse<AuthData>>('/users/login', data)
    return response.data
}

export const logoutUser = async () => {
    const response = await api.post('/users/logout')
    return response.data
}

export interface UpdateDetailsPayload {
    full_name?: string
    phone_number?: string
    gender?: string
    DOB?: string
}

export const updateUserDetails = async (data: UpdateDetailsPayload) => {
    const response = await api.patch<ApiResponse<User>>('/users/updatedetails', data)
    return response.data
}

export const requestEmailUpdate = async (email: string) => {
    const response = await api.post<ApiResponse<{}>>('/users/updateemail', { email })
    return response.data
}

export const verifyEmailUpdate = async (data: VerifyEmailData) => {
    const response = await api.post<ApiResponse<{}>>('/users/verifyemail', data)
    return response.data
}

export const forgotPassword = async (email: string) => {
    const response = await api.post<ApiResponse<string>>('/users/forgotpassword', { email })
    return response.data
}