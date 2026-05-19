'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    ArrowLeft,
    Mail,
    Loader2,
    CheckCircle2
} from 'lucide-react'

import { emailSchema } from '@/lib/validators'
import { forgotPassword } from '@/services/authService'

export default function ForgotPasswordPage() {

    const router = useRouter()

    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleEmailChange = (value: string) => {

        setEmail(value)

        if (submitted) {

            const result = emailSchema.safeParse(value)

            if (!result.success) {
                setEmailError(result.error.issues[0].message)
            } else {
                setEmailError('')
            }
        }
    }

    const handleSubmit = async () => {

        setSubmitted(true)

        const val = email.trim()

        const result = emailSchema.safeParse(val)

        if (!result.success) {

            setEmailError(result.error.issues[0].message)

            return
        }

        setEmailError('')

        setLoading(true)

        try {

            const res = await forgotPassword(val)

            toast.success(
                res.message || 'Reset link sent'
            )

            setSent(true)

        } catch (e: any) {

            toast.error(
                e.response?.data?.message ||
                'Failed to send reset link'
            )

        } finally {

            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0F1226] flex flex-col">

            {/* TOP */}
            <div className="px-6 pt-10 pb-16 text-white relative">

                <button
                    type="button"
                    onClick={() => router.back()}
                    className="absolute left-6 top-10 bg-white hover:bg-white/80 text-black p-2 rounded-full"
                >
                    <ArrowLeft size={18} />
                </button>

                <div className="text-center mt-10">

                    <h1 className="text-2xl font-bold">
                        Forgot Password
                    </h1>

                    <p className="text-gray-400 text-sm mt-2">
                        {sent
                            ? 'Check your inbox for the reset link'
                            : "We'll send a reset link to your email"
                        }
                    </p>

                </div>
            </div>

            {/* CARD */}
            <div className="bg-white rounded-t-3xl px-6 py-10 flex-1">

                <div className="max-w-md mx-auto">

                    {sent ? (

                        /* SUCCESS STATE */
                        <div className="flex flex-col items-center text-center gap-5 pt-4">

                            <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">

                                <CheckCircle2
                                    size={40}
                                    className="text-[#F97316]"
                                />

                            </div>

                            <div>

                                <p className="text-base font-bold text-[#1E2A3A]">
                                    Reset link sent!
                                </p>

                                <p className="text-sm text-gray-400 mt-1">
                                    We sent a password reset link to
                                </p>

                                <p className="text-sm font-semibold text-[#1E2A3A] mt-0.5">
                                    {email}
                                </p>

                            </div>

                            <p className="text-xs text-gray-400 max-w-xs">
                                Open the link in the email to reset your password.
                                Check your spam folder if you don't see it.
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setSent(false)
                                    setEmail('')
                                    setEmailError('')
                                    setSubmitted(false)
                                }}
                                className="text-sm text-[#F97316] font-semibold"
                            >
                                Use a different email
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push('/login')}
                                className="w-full bg-[#1E2A3A] text-white text-sm font-semibold py-4 rounded-xl mt-2"
                            >
                                Back to Login
                            </button>

                        </div>

                    ) : (

                        /* FORM STATE */
                        <div className="space-y-4">

                            <div>

                                <label className="text-xs text-gray-500 font-medium tracking-wide">
                                    EMAIL ADDRESS
                                </label>

                                <div className="relative mt-1">

                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Mail size={16} />
                                    </div>

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e =>
                                            handleEmailChange(e.target.value)
                                        }
                                        onKeyDown={e =>
                                            e.key === 'Enter' &&
                                            handleSubmit()
                                        }
                                        placeholder="example@gmail.com"
                                        disabled={loading}
                                        autoComplete="off"
                                        className={`w-full bg-gray-100 rounded-xl pl-10 pr-4 py-4 text-sm outline-none disabled:opacity-60 border
                                            
                                            ${emailError
                                                ? 'border-red-500'
                                                : 'border-transparent'
                                            }
                                        `}
                                    />

                                </div>

                                {emailError && (

                                    <p className="text-red-500 text-xs mt-1">
                                        {emailError}
                                    </p>

                                )}

                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading || !email.trim()}
                                className="mx-auto w-full py-4 mt-4 bg-[#F97316] hover:bg-[#F97316]/80 text-white rounded-xl font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                            >

                                {loading && (
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                )}

                                {loading
                                    ? 'Sending...'
                                    : 'Send Reset Link'
                                }

                            </button>

                            <button
                                type="button"
                                onClick={() => router.push('/login')}
                                className="w-full text-center text-sm text-gray-400 mt-2"
                            >
                                Back to Login
                            </button>

                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}