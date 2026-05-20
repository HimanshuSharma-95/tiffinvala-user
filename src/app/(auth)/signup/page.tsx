'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { startRegistration } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { signupSchema, SignupFormData } from '@/lib/validators'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {

    const router = useRouter()
    const { setPendingEmail } = useAuthStore()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema)
    })

    const onSubmit = async (data: SignupFormData) => {
        setLoading(true)
        try {
            // remove confirmPassword — backend doesn't need it
            const { confirmPassword, ...sendData } = data
            const res = await startRegistration(sendData)
            setPendingEmail(data.email)
            toast.success(res.message)
            router.push('/verify-otp')
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0F1226] flex flex-col">

            {/* TOP SECTION */}
            <div className="px-6 pt-10 pb-16 text-center text-white relative">

                <button
                    onClick={() => router.back()}
                    className="absolute left-6 top-10 bg-white hover:bg-white/80 text-black p-2 rounded-full"
                >
                    <ArrowLeft size={18} />
                </button>

                <h1 className="text-2xl font-bold mt-10">
                    Sign Up
                </h1>

                {/* <p className="text-gray-300 text-sm mt-2">
                    Please sign up to get started
                </p> */}

                {/* LOGIN LINK */}
                <div className="mt-2 text-sm text-gray-300">

                    Already have an account?{' '}

                    <button
                        onClick={() => router.push('/login')}
                        className="text-[#F97316] font-semibold hover:underline"
                    >
                        Login
                    </button>

                </div>

            </div>

            {/* FORM CARD */}
            <div className="bg-white rounded-t-3xl px-6 py-8 flex-1">
                <div className="max-w-md mx-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

                        {/* Full Name */}
                        <div>
                            <label className="text-xs text-gray-500 font-medium">FULL NAME</label>
                            <input
                                {...register('full_name')}
                                placeholder="John Doe"
                                className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-4 text-sm outline-none"
                            />
                            {errors.full_name && (
                                <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-xs text-gray-500 font-medium">EMAIL</label>
                            <input
                                {...register('email')}
                                type="email"
                                placeholder="example@gmail.com"
                                suppressHydrationWarning
                                className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-4 text-sm outline-none"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-xs text-gray-500 font-medium">PHONE NO</label>
                            <input
                                {...register('phone_number')}
                                type="tel"
                                placeholder="Phone no."
                                className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-4 text-sm outline-none"
                            />
                            {errors.phone_number && (
                                <p className="text-red-500 text-xs mt-1">{errors.phone_number.message}</p>
                            )}
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="text-xs text-gray-500 font-medium">GENDER</label>
                            <select
                                {...register('gender')}
                                className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-4 text-sm outline-none"
                            >
                                <option value="">Male / Female / Other</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.gender && (
                                <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
                            )}
                        </div>

                        {/* DOB */}
                        {/* <div>
                            <label className="text-xs text-gray-500 font-medium">DATE OF BIRTH</label>
                            <input
                                {...register('DOB')}
                                type="date"
                                className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-4 text-sm outline-none"
                            />
                            {errors.DOB && (
                                <p className="text-red-500 text-xs mt-1">{errors.DOB.message}</p>
                            )}
                        </div> */}

                        {/* DOB */}
                        <div>

                            <label className="text-xs text-gray-500 font-medium">
                                DATE OF BIRTH
                            </label>

                            <div className="relative mt-1">

                                <input
                                    {...register('DOB')}
                                    type="date"
                                    placeholder="Select date"
                                    className="
                w-full
                h-14
                bg-gray-100
                rounded-xl
                px-4
                text-sm
                outline-none
                appearance-none
                text-[#1E2A3A]
                [&::-webkit-calendar-picker-indicator]:opacity-70
                [&::-webkit-calendar-picker-indicator]:cursor-pointer
                [&::-webkit-date-and-time-value]:text-left
                [&::-webkit-date-and-time-value]:min-h-[1.5em]
                ios-date-input
            "
                                />

                            </div>

                            {
                                errors.DOB && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.DOB.message}
                                    </p>
                                )
                            }

                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-xs text-gray-500 font-medium">PASSWORD</label>
                            <div className="relative mt-1">
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    suppressHydrationWarning
                                    className="w-full bg-gray-100 rounded-xl px-4 py-4 text-sm outline-none pr-12"
                                />


                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="text-xs text-gray-500 font-medium">PASSWORD</label>
                            <div className="relative mt-1">
                                <input
                                    {...register('confirmPassword')}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Re-enter password"
                                    suppressHydrationWarning
                                    className="w-full bg-gray-100 rounded-xl px-4 py-4 text-sm outline-none pr-12"
                                />


                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="block mx-auto w-auto px-20 py-3 md:px-30 md:py-4 mt-6 bg-[#F97316] hover:bg-[#F97316]/80 text-white rounded-xl font-semibold tracking-wider text-sm md:text-base disabled:opacity-60"
                        >
                            {loading ? 'PLEASE WAIT...' : 'SIGN UP'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}