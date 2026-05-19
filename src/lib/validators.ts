import { z } from 'zod'

export const signupSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone_number: z.string().length(10, 'Phone number must be 10 digits'),
    gender: z.enum(['male', 'female', 'other'], { message: 'Please select gender' }),
    DOB: z.string().min(1, 'Date of birth is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // error shows on confirmPassword field
})

export const loginSchema = z.object({
    identifier: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const addressSchema = z.object({
    addressLine1: z.string().min(2, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().min(3, 'Zip code is required'),
    country: z.string().min(2, 'Country is required'),
})

export const emailSchema = z.string().email('Enter a valid email address')

// Auto-generate TypeScript types from schemas — no need to write them manually
export type SignupFormData = z.infer<typeof signupSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type AddressFormData = z.infer<typeof addressSchema>