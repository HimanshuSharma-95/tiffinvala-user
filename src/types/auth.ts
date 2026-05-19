export interface Address {
    _id?: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    zipCode: string
    country: string
    location: {
        lat: number
        lng: number
    }
    area?: string
    createdAt?: string
    updatedAt?: string
}

export interface User {
    _id: string
    username: string
    full_name: string
    email: string
    phone_number: string
    gender: string
    DOB: string
    is_email_verified: boolean
    avatar: string
    addresses: Address[]
    createdAt: string
    updatedAt: string
}

export interface RegisterData {
    full_name: string
    email: string
    phone_number: string
    gender: string
    DOB: string
    password: string
}

export interface VerifyEmailData {
    email: string
    otp: string
}

export interface LoginData {
    identifier: string
    password: string
}

export interface AuthData {
    user: User
    accesstoken: string
    refreshtoken: string
}