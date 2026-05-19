'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { verifyEmailAndRegister } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function VerifyOtpPage() {
    const router = useRouter()
    const { pendingEmail, setUser } = useAuthStore()
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Auto move to next input
    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return // numbers only
        const newOtp = [...otp]
        newOtp[index] = value.slice(-1) // only last digit
        setOtp(newOtp)
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    // Handle backspace
    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const otpString = otp.join('')
        if (otpString.length !== 6) {
            toast.error('Please enter the complete 6-digit OTP')
            return
        }
        if (!pendingEmail) {
            toast.error('Email not found, please signup again')
            router.push('/signup')
            return
        }
        setLoading(true)
        try {
            const response = await verifyEmailAndRegister({
                email: pendingEmail,
                otp: otpString,
            })
            // cookie set by backend, just save user
            setUser(response.data.user)
            toast.success('Account created successfully!')
            router.push('/')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid OTP')
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
                    className="absolute left-6 top-10 bg-white text-black p-2 rounded-full"
                >
                    <ArrowLeft size={18} />
                </button>

                <h1 className="text-2xl font-bold mt-10">Verify Email</h1>
                <p className="text-gray-300 text-sm mt-2">
                    OTP sent to{' '}
                    <span className="text-[#F97316] font-medium">
                        {pendingEmail || 'your email'}
                    </span>
                </p>
            </div>

            {/* FORM CARD */}
            <div className="bg-white rounded-t-3xl px-6 py-8 flex-1">

                <div className="max-w-md mx-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="flex gap-3 justify-between mt-4 mb-8">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 text-center text-xl font-bold bg-gray-100 rounded-xl outline-none text-[#1E2A3A]"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#F97316] text-white py-4 rounded-xl font-semibold tracking-wider"
                        >
                            {loading ? 'VERIFYING...' : 'VERIFY OTP'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Wrong email?{' '}
                        <Link href="/signup" className="text-[#F97316] font-semibold">
                            Go back
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}