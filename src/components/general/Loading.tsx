export default function Loading({ size = 16 }: { size?: number }) {
    return (
        <div
            style={{ width: size, height: size }}
            className="border-2 border-[#F97316] border-t-transparent rounded-full animate-spin"
        />
    )
}