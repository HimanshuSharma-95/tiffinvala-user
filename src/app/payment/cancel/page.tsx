import { X } from "lucide-react";
import Link from "next/link";

interface PaymentCancelPageProps {
  searchParams: Promise<{
    order_id?: string;
  }>;
}

export default async function PaymentCancelPage({
  searchParams,
}: PaymentCancelPageProps) {
  const params = await searchParams;

  const orderId = params.order_id;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 pb-24">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        {/* Icon badge */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
          <X className="h-10 w-10 text-red-500" strokeWidth={2.5} />
        </div>

        {/* Heading */}
        <h1 className="mt-5 text-xl font-bold text-gray-800">
          Payment Cancelled
        </h1>

        <p className="mt-1.5 text-sm text-gray-400">
          No payment was completed. You can try again anytime
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="mt-5 w-full rounded-xl bg-gray-100 px-4 py-3 text-left">
            <p className="text-xs text-gray-400">Order ID</p>
            <p className="mt-0.5 break-all text-sm font-medium text-gray-800">
              {orderId}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex w-full flex-col gap-2.5">
          {/* <Link
            href="/checkout"
            className="w-full rounded-xl bg-[#F97316] px-4 py-2.5 text-center text-sm font-semibold tracking-wide text-white transition hover:opacity-90"
          >
            Return to Checkout
          </Link> */}

          <Link
            href="/profile/orders"
            className="w-full rounded-xl bg-[#F97316] px-4 py-2.5 text-center text-sm font-semibold tracking-wide text-white transition hover:opacity-90"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </main>
  );
}
