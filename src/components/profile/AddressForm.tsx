'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, LoaderCircle, MapPin } from 'lucide-react'
import { addressSchema, AddressFormData } from '@/lib/validators'
import { Address } from '@/types/auth'
import { AddressPayload } from '@/services/profileService'

interface AddressFormProps {
    title: string
    submitLabel: string
    initialAddress?: Address
    isSaving?: boolean
    saveError?: string | null
    onBack: () => void
    onSubmit: (payload: AddressPayload) => Promise<void>
}

const SCRIPT_ID = 'google-maps-script'

const getComponent = (
    components: Array<{ long_name: string; short_name: string; types: string[] }> | undefined,
    type: string,
    key: 'long_name' | 'short_name' = 'long_name'
) => components?.find(c => c.types.includes(type))?.[key] ?? ''

// function loadMapsApi(apiKey: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//         // Already loaded
//         if ((window as any).google?.maps?.places) {
//             resolve()
//             return
//         }
//         // Script already injected, wait for it
//         const existing = document.getElementById(SCRIPT_ID)
//         if (existing) {
//             existing.addEventListener('load', () => resolve())
//             existing.addEventListener('error', () => reject())
//             return
//         }
//         // Fresh inject — use loading=async to silence the warning
//         const script = document.createElement('script')
//         script.id = SCRIPT_ID
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`
//         script.async = true
//         script.defer = true
//         script.onload = () => resolve()
//         script.onerror = () => reject(new Error('Script load failed'))
//         document.head.appendChild(script)
//     })
// }

function loadMapsApi(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {

        // Already fully loaded
        if ((window as any).google?.maps?.places) {
            resolve()
            return
        }

        const existingScript = document.getElementById(
            SCRIPT_ID
        ) as HTMLScriptElement | null

        // Script exists but API still loading
        if (existingScript) {

            const checkGoogle = setInterval(() => {

                if ((window as any).google?.maps?.places) {

                    clearInterval(checkGoogle)
                    resolve()
                }

            }, 100)

            // Safety timeout
            setTimeout(() => {
                clearInterval(checkGoogle)
                reject(new Error('Google Maps timeout'))
            }, 10000)

            return
        }

        // Inject fresh script
        const script = document.createElement('script')

        script.id = SCRIPT_ID

        script.src =
            `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`

        script.async = true
        script.defer = true

        script.onload = () => {

            const checkGoogle = setInterval(() => {

                if ((window as any).google?.maps?.places) {

                    clearInterval(checkGoogle)
                    resolve()
                }

            }, 100)
        }

        script.onerror = () => {
            reject(new Error('Script load failed'))
        }

        document.head.appendChild(script)
    })
}

export default function AddressForm({
    title,
    submitLabel,
    initialAddress,
    isSaving = false,
    saveError,
    onBack,
    onSubmit,
}: AddressFormProps) {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const autocompleteRef = useRef<any>(null)

    const [location, setLocation] = useState<Address['location'] | null>(
        initialAddress?.location ?? null
    )
    const [placesError, setPlacesError] = useState<string | null>(null)

    const apiKey = useMemo(() => process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '', [])

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            addressLine1: initialAddress?.addressLine1 ?? '',
            addressLine2: initialAddress?.addressLine2 ?? '',
            city: initialAddress?.city ?? '',
            state: initialAddress?.state ?? '',
            zipCode: initialAddress?.zipCode ?? '',
            country: initialAddress?.country ?? '',
        },
    })

    useEffect(() => {
        if (!apiKey) {
            setPlacesError('Google Maps API key is missing.')
            return
        }

        let cancelled = false

        loadMapsApi(apiKey)
            .then(() => {
                if (cancelled || !inputRef.current) return

                const g = (window as any).google
                if (!g?.maps?.places?.Autocomplete) {
                    setPlacesError('Google Places failed to load.')
                    return
                }

                const autocomplete = new g.maps.places.Autocomplete(inputRef.current, {
                    fields: ['address_components', 'formatted_address', 'geometry'],
                    types: ['address'],
                })

                autocompleteRef.current = autocomplete

                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace()
                    const lat = place.geometry?.location?.lat()
                    const lng = place.geometry?.location?.lng()

                    if (typeof lat !== 'number' || typeof lng !== 'number') {
                        setPlacesError('No location found for that address. Try another.')
                        return
                    }

                    setPlacesError(null)
                    setLocation({ lat, lng })

                    const c = place.address_components
                    setValue('addressLine1', place.formatted_address ?? inputRef.current?.value ?? '')
                    setValue('city', getComponent(c, 'locality') || getComponent(c, 'sublocality_level_1'))
                    setValue('state', getComponent(c, 'administrative_area_level_1'))
                    setValue('zipCode', getComponent(c, 'postal_code'))
                    setValue('country', getComponent(c, 'country'))
                })
            })
            .catch((err) => {
                console.error('Maps load error:', err)
                if (!cancelled) setPlacesError('Could not load address search. Fill in manually.')
            })

        return () => { cancelled = true }
    }, [apiKey, setValue])

    const submitHandler = async (values: AddressFormData) => {
        if (!location) {
            setPlacesError('Pick a suggestion from Address Line 1 to capture coordinates.')
            return
        }
        await onSubmit({
            addressLine1: values.addressLine1,
            addressLine2: values.addressLine2 ?? '',
            city: values.city,
            state: values.state,
            zipCode: values.zipCode,
            country: values.country,
            location,
        })
    }

    // Merge RHF ref with our inputRef
    const { ref: rhfRef, ...addressLine1Rest } = register('addressLine1')

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto w-full max-w-2xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">

                <div className="flex items-center justify-between">
                    <button onClick={onBack}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className="text-lg font-semibold text-[#1E2A3A]">{title}</h1>
                    <div className="h-10 w-10" />
                </div>

                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-5 flex items-center gap-3 rounded-xl bg-orange-50 px-4 py-3 text-orange-700">
                        <MapPin size={18} />
                        <p className="text-sm">Select an address from suggestions to auto-capture location.</p>
                    </div>

                    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

                        <div>
                            <label className="text-xs font-medium text-gray-500">ADDRESS LINE 1</label>
                            <input
                                {...addressLine1Rest}
                                ref={(el) => {
                                    rhfRef(el)
                                    inputRef.current = el
                                }}
                                placeholder="Start typing your address…"
                                className="mt-1 w-full rounded-xl bg-gray-100 px-4 py-3 text-sm outline-none ring-orange-200 focus:ring"
                            />
                            {errors.addressLine1 && (
                                <p className="mt-1 text-xs text-red-500">{errors.addressLine1.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-500">ADDRESS LINE 2 (OPTIONAL)</label>
                            <input {...register('addressLine2')} placeholder="Apartment, suite, landmark"
                                className="mt-1 w-full rounded-xl bg-gray-100 px-4 py-3 text-sm outline-none ring-orange-200 focus:ring" />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {[
                                { label: 'CITY', key: 'city', placeholder: 'City' },
                                { label: 'STATE', key: 'state', placeholder: 'State' },
                                { label: 'ZIP CODE', key: 'zipCode', placeholder: 'Zip code' },
                                { label: 'COUNTRY', key: 'country', placeholder: 'Country' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="text-xs font-medium text-gray-500">{f.label}</label>
                                    <input
                                        {...register(f.key as keyof AddressFormData)}
                                        placeholder={f.placeholder}
                                        className="mt-1 w-full rounded-xl bg-gray-100 px-4 py-3 text-sm outline-none ring-orange-200 focus:ring"
                                    />
                                    {errors[f.key as keyof AddressFormData] && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors[f.key as keyof AddressFormData]?.message}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {(placesError || saveError) && (
                            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                                {placesError || saveError}
                            </p>
                        )}

                        {!location && !placesError && (
                            <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-700">
                                Pick a suggestion in Address Line 1 to capture map coordinates.
                            </p>
                        )}

                        <button type="submit" disabled={isSaving}
                            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] px-4 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#F97316]/90 disabled:cursor-not-allowed disabled:opacity-70">
                            {isSaving
                                ? <><LoaderCircle size={16} className="animate-spin" />Saving...</>
                                : submitLabel
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}