'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    resetPasswordSchema,
    ResetPasswordFormData
} from '@/lib/validators'
import { resetPassword } from '@/services/authService'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {

    const router = useRouter()
    const params = useParams()

    const token = params.token as string

    const [loading, setLoading] = useState(false)

    const [showPassword, setShowPassword] =
        useState(false)

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false)

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            touchedFields,
            isSubmitted
        }
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(
            resetPasswordSchema
        ),
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    })

    const onSubmit = async (
        data: ResetPasswordFormData
    ) => {

        setLoading(true)

        try {

            const response =
                await resetPassword(
                    token,
                    data.password
                )

            toast.success(
                'Password updated successfully. Redirecting to login page...'
            )

            setTimeout(() => {
                window.location.replace('/login')
            }, 2000)

        } catch (error: any) {

            toast.error(
                'Failed to reset password'
            )

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0F1226] flex flex-col">

            {/* TOP SECTION */}

            <div className="px-6 pt-10 pb-16 text-center text-white relative">

                <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="absolute left-6 top-10 bg-white hover:bg-white/80 text-black p-2 rounded-full"
                >
                    <ArrowLeft size={18} />
                </button>

                <h1 className="text-2xl font-bold mt-10">
                    Reset Password
                </h1>

                <p className="text-gray-300 text-sm mt-2">
                    Enter your new password
                </p>

            </div>

            {/* FORM CARD */}

            <div className="bg-white rounded-t-3xl px-6 py-8 flex-1">

                <div className="max-w-md mx-auto">

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >

                        {/* NEW PASSWORD */}

                        <div>

                            <label className="text-xs text-gray-500 font-medium">
                                NEW PASSWORD
                            </label>

                            <div className="relative mt-1">

                                <input
                                    {...register('password')}
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Enter new password"
                                    className="w-full bg-gray-100 rounded-xl px-4 py-4 text-sm outline-none pr-12"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />
                                    }
                                </button>

                            </div>

                            {(touchedFields.password || isSubmitted) &&
                                errors.password && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.password.message}
                                    </p>
                                )}

                        </div>

                        {/* CONFIRM PASSWORD */}

                        <div>

                            <label className="text-xs text-gray-500 font-medium">
                                CONFIRM PASSWORD
                            </label>

                            <div className="relative mt-1">

                                <input
                                    {...register(
                                        'confirmPassword'
                                    )}
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Confirm password"
                                    className="w-full bg-gray-100 rounded-xl px-4 py-4 text-sm outline-none pr-12"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showConfirmPassword
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />
                                    }
                                </button>

                            </div>

                            {(touchedFields.confirmPassword ||
                                isSubmitted) &&
                                errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {
                                            errors
                                                .confirmPassword
                                                .message
                                        }
                                    </p>
                                )}

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="block mx-auto mt-10 w-auto px-20 py-3 md:px-30 md:py-4 bg-[#F97316] hover:bg-[#F97316]/80 text-white rounded-xl font-semibold tracking-wider text-sm md:text-base disabled:opacity-60"
                        >
                            {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
                        </button>

                    </form>

                </div>

            </div>

        </div>
    )
}