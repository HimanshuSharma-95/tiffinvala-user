// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { toast } from 'sonner'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { loginUser } from '@/services/authService'
// import { useAuthStore } from '@/store/authStore'
// import { loginSchema, LoginFormData } from '@/lib/validators'
// import Link from 'next/link'
// import { ArrowLeft, Eye, EyeOff } from 'lucide-react'

// export default function LoginPage() {
//     const router = useRouter()
//     const { setUser } = useAuthStore()
//     const [loading, setLoading] = useState(false)
//     const [showPassword, setShowPassword] = useState(false)

//     const {
//         register,
//         handleSubmit,
//         formState: { errors, touchedFields, isSubmitted }
//     } = useForm<LoginFormData>({
//         resolver: zodResolver(loginSchema),
//         mode: 'onSubmit',
//         reValidateMode: 'onChange'
//     })

//     const onSubmit = async (data: LoginFormData) => {
//         setLoading(true)
//         try {
//             const response = await loginUser(data)
//             setUser(response.data.user)
//             toast.success(response.message)
//             router.push('/')
//         } catch (error: any) {
//             toast.error(error.response?.data?.message || 'Login failed')
//         } finally {
//             setLoading(false)
//         }
//     }

//     return (
//         <div className="min-h-screen bg-[#0F1226] flex flex-col">

//             {/* TOP SECTION */}
//             <div className="px-6 pt-10 pb-16 text-center text-white relative">
//                 <button
//                     onClick={() => router.back()}
//                     className="absolute left-6 top-10 bg-white  hover:bg-white/80 text-black p-2 rounded-full"
//                 >
//                     <ArrowLeft size={18} />
//                 </button>

//                 <h1 className="text-2xl font-bold mt-10">Welcome Back</h1>
//                 <p className="text-gray-300 text-sm mt-2">
//                     Login to your Tiffinvala account
//                 </p>
//             </div>

//             {/* FORM CARD */}
//             <div className="bg-white rounded-t-3xl px-6 py-8 flex-1">
//                 <div className="max-w-md mx-auto">
//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

//                         {/* Email */}
//                         <div>
//                             <label className="text-xs text-gray-500 font-medium">EMAIL</label>
//                             <input
//                                 {...register('identifier')}
//                                 type="email"
//                                 placeholder="example@gmail.com"
//                                 suppressHydrationWarning
//                                 className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-4 text-sm outline-none"
//                             />
//                             {(touchedFields.identifier || isSubmitted) && errors.identifier && (
//                                 <p className="text-red-500 text-xs mt-1">
//                                     {errors.identifier.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Password */}
//                         <div>
//                             <label className="text-xs text-gray-500 font-medium">PASSWORD</label>
//                             <div className="relative mt-1">
//                                 <input
//                                     {...register('password')}
//                                     type={showPassword ? 'text' : 'password'}
//                                     placeholder="Enter your password"
//                                     className="w-full bg-gray-100 rounded-xl px-4 py-4 text-sm outline-none pr-12"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//                                 >
//                                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                                 </button>
//                             </div>
//                             {(touchedFields.password || isSubmitted) && errors.password && (
//     <p className="text-red-500 text-xs mt-1">
//         {errors.password.message}
//     </p>
// )}
//                         </div>

//                         {/* Forgot Password */}
//                         <div className="text-right">
//                             <button onClick={() => router.push('/forgot-password')}
//                                 className="text-sm text-[#F97316] font-medium">
//                                 Forgot password?
//                             </button>
//                         </div>


//                         {/* Submit */}
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             // className="w-full bg-[#F97316] text-white py-4 rounded-xl font-semibold tracking-wider mt-2 disabled:opacity-60"
//                             className="block mx-auto w-auto px-20 py-3 md:px-30 md:py-4 bg-[#F97316] hover:bg-[#F97316]/80 text-white rounded-xl font-semibold tracking-wider text-sm md:text-base disabled:opacity-60">
//                             {loading ? 'LOGGING IN...' : 'LOGIN'}
//                         </button>


//                     </form>

//                     <p className="text-center text-sm text-gray-500 mt-6">
//                         Don't have an account?{' '}
//                         <Link href="/signup" className="text-[#F97316] font-semibold">
//                             Sign Up
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     )
// }


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginUser } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { loginSchema, LoginFormData } from '@/lib/validators'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const { setUser } = useAuthStore()

    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields, isSubmitted }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    })

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true)

        try {
            const response = await loginUser(data)

            setUser(response.data.user)

            toast.success(response.message)

            router.push('/')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed')
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
                    onClick={() => router.back()}
                    className="absolute left-6 top-10 bg-white hover:bg-white/80 text-black p-2 rounded-full"
                >
                    <ArrowLeft size={18} />
                </button>

                <h1 className="text-2xl font-bold mt-10">
                    Welcome Back
                </h1>

                <p className="text-gray-300 text-sm mt-2">
                    Login to your Tiffinvala account
                </p>
            </div>

            {/* FORM CARD */}
            <div className="bg-white rounded-t-3xl px-6 py-8 flex-1">

                <div className="max-w-md mx-auto">

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                        autoComplete="off"
                    >

                        {/* EMAIL */}
                        <div>

                            <label className="text-xs text-gray-500 font-medium">
                                EMAIL
                            </label>

                            <input
                                {...register('identifier')}
                                type="email"
                                autoComplete="on"
                                placeholder="example@gmail.com"
                                suppressHydrationWarning
                                className="w-full mt-1 bg-gray-100 rounded-xl px-4 py-4 text-sm outline-none"
                            />

                            {(touchedFields.identifier || isSubmitted) &&
                                errors.identifier && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.identifier.message}
                                    </p>
                                )}
                        </div>

                        {/* PASSWORD */}
                        <div>

                            <label className="text-xs text-gray-500 font-medium">
                                PASSWORD
                            </label>

                            <div className="relative mt-1">

                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="Enter your password"
                                    className="w-full bg-gray-100 rounded-xl px-4 py-4 text-sm outline-none pr-12"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>

                            {(touchedFields.password || isSubmitted) &&
                                errors.password && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                        </div>

                        {/* FORGOT PASSWORD */}
                        <div className="text-right">

                            <button
                                type="button"
                                onClick={() =>
                                    router.push('/forgot-password')
                                }
                                className="text-sm text-[#F97316] font-medium"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="block mx-auto w-auto px-20 py-3 md:px-30 md:py-4 bg-[#F97316] hover:bg-[#F97316]/80 text-white rounded-xl font-semibold tracking-wider text-sm md:text-base disabled:opacity-60"
                        >
                            {loading ? 'LOGGING IN...' : 'LOGIN'}
                        </button>

                    </form>

                    {/* SIGN UP */}
                    <p className="text-center text-sm text-gray-500 mt-6">

                        Don't have an account?{' '}

                        <Link
                            href="/signup"
                            className="text-[#F97316] font-semibold"
                        >
                            Sign Up
                        </Link>

                    </p>

                </div>

            </div>
        </div>
    )
}