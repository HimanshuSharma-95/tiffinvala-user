// "use client";

// import { useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { useAuthStore } from "@/store/authStore";
// import {
//   updateUserDetails,
//   requestEmailUpdate,
//   verifyEmailUpdate,
// } from "@/services/authService";
// import {
//   ArrowLeft,
//   User,
//   Mail,
//   Phone,
//   AtSign,
//   Calendar,
//   Venus,
//   Check,
//   Loader2,
// } from "lucide-react";
// import { emailSchema } from "@/lib/validators";

// type EditField = "details" | "email" | "otp" | null;

// function InfoRow({
//   icon,
//   label,
//   value,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value?: string;
// }) {
//   return (
//     <div className="flex items-center gap-4 px-4 py-4">
//       <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
//         {icon}
//       </div>
//       <div className="min-w-0">
//         <p className="text-xs text-gray-400 tracking-wide">{label}</p>
//         <p className="text-sm font-medium text-[#1E2A3A] truncate">
//           {value || "—"}
//         </p>
//       </div>
//     </div>
//   );
// }

// export default function PersonalInfoPage() {
//   const router = useRouter();
//   const { user, setUser, setPendingEmail, pendingEmail } = useAuthStore();

//   const [editMode, setEditMode] = useState<EditField>(null);
//   const [saving, setSaving] = useState(false);

//   // ── Initialise form from current user ────────────────────────────────────
//   const initialForm = useMemo(
//     () => ({
//       full_name: user?.full_name || "",
//       phone_number: user?.phone_number || "",
//       gender: user?.gender || "",
//       DOB: user?.DOB ? user.DOB.split("T")[0] : "",
//     }),
//     [user],
//   );

//   const [form, setForm] = useState(initialForm);

//   // only show Save when something actually changed
//   const isDirty = useMemo(
//     () =>
//       (Object.keys(form) as (keyof typeof form)[]).some(
//         (k) => form[k] !== initialForm[k],
//       ),
//     [form, initialForm],
//   );

//   const openEdit = () => {
//     setForm(initialForm); // reset to latest saved values every time
//     setEditMode("details");
//   };

//   // ── email update state
//   const [newEmail, setNewEmail] = useState("");
//   const [otp, setOtp] = useState("");

//   const initials =
//     user?.full_name
//       ?.split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase() || "U";

//   const formatDOB = (iso: string) => {
//     if (!iso) return "—";
//     return new Date(iso).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   // ── Save profile details ─────────────────────────────────────────────────
//   const handleSaveDetails = async () => {
//     setSaving(true);
//     try {
//       const res = await updateUserDetails({
//         full_name: form.full_name,
//         phone_number: form.phone_number,
//         gender: form.gender,
//         DOB: form.DOB ? new Date(form.DOB).toISOString() : undefined,
//       });
//       setUser(res.data); // ← was res.data.user
//       toast.success("Profile updated");
//       setEditMode(null);
//     } catch (e: any) {
//       toast.error(e.response?.data?.message || "Update failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Request email OTP ────────────────────────────────────────────────────
//   const handleRequestEmailOtp = async () => {
//     const email = newEmail.trim();
//     if (!email) return toast.error("Enter a new email");

//     const result = emailSchema.safeParse(email);
//     if (!result.success) return toast.error(result.error.issues[0].message);
//     if (email === user?.email)
//       return toast.error("New email is same as current email");

//     setSaving(true);
//     try {
//       await requestEmailUpdate(email);
//       setPendingEmail(email);
//       toast.success("OTP sent to new email");
//       setEditMode("otp");
//     } catch (e: any) {
//       toast.error(e.response?.data?.message || "Failed to send OTP");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Verify OTP ───────────────────────────────────────────────────────────
//   const handleVerifyEmailOtp = async () => {
//     if (otp.length < 6) return toast.error("Enter the 6-digit OTP");
//     setSaving(true);
//     try {
//       await verifyEmailUpdate({ email: pendingEmail!, otp: otp.trim() });
//       setUser((prev) => (prev ? { ...prev, email: pendingEmail! } : prev));
//       toast.success("Email updated successfully");
//       setEditMode(null);
//       setOtp("");
//       setNewEmail("");
//     } catch (e: any) {
//       toast.error(e.response?.data?.message || "Invalid OTP");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const inputClass = (disabled: boolean) =>
//     `w-full mt-1 h-12 rounded-xl px-4 text-sm outline-none border transition appearance-none
//     ${
//       disabled
//         ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
//         : "bg-white border-gray-200 text-[#1E2A3A] focus:border-[#F97316]"
//     }`;

//   return (
//     <div className="min-h-screen bg-white">
//       {/* HEADER */}
//       <div className="flex items-center justify-between px-4 py-4 max-w-md mx-auto">
//         <button
//           onClick={() => router.back()}
//           className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
//         >
//           <ArrowLeft size={18} />
//         </button>
//         <h1 className="text-base font-bold text-[#1E2A3A]">Personal Info</h1>
//         <div className="w-10" />
//       </div>

//       <div className="max-w-md mx-auto px-4 pb-12">
//         {/* AVATAR */}
//         <div className="flex flex-col items-center text-center gap-2 py-6">
//           <div className="w-20 h-20 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
//             {user?.avatar ? (
//               <img
//                 src={user.avatar}
//                 alt="avatar"
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <span className="text-2xl font-bold text-orange-400">
//                 {initials}
//               </span>
//             )}
//           </div>
//           <div>
//             <h2 className="text-lg font-bold text-[#1E2A3A]">
//               {user?.full_name}
//             </h2>
//             {user?.username && (
//               <p className="text-xs text-gray-400">{user.username}</p>
//             )}
//           </div>
//         </div>

//         {/* ── DETAILS CARD ── */}
//         <div className="flex items-center justify-between mb-2">
//           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
//             Profile Details
//           </p>
//           {editMode !== "details" ? (
//             <button
//               onClick={openEdit}
//               className="text-xs font-semibold text-[#F97316]"
//             >
//               EDIT
//             </button>
//           ) : (
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => setEditMode(null)}
//                 disabled={saving}
//                 className="text-xs text-gray-400 disabled:opacity-40"
//               >
//                 Cancel
//               </button>
//               {isDirty && (
//                 <button
//                   onClick={handleSaveDetails}
//                   disabled={saving}
//                   className="text-xs font-semibold text-[#F97316] flex items-center gap-1 disabled:opacity-60"
//                 >
//                   {saving ? (
//                     <Loader2 size={13} className="animate-spin" />
//                   ) : (
//                     <Check size={13} />
//                   )}
//                   Save
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="bg-gray-100 rounded-2xl overflow-hidden mb-4">
//           {editMode === "details" ? (
//             <div className="p-4 space-y-3">
//               <div>
//                 <label className="text-xs text-gray-400 tracking-wide">
//                   FULL NAME
//                 </label>
//                 <input
//                   type="text"
//                   value={form.full_name}
//                   onChange={(e) =>
//                     setForm((p) => ({ ...p, full_name: e.target.value }))
//                   }
//                   placeholder="Full name"
//                   disabled={saving}
//                   className={inputClass(saving)}
//                 />
//               </div>

//               <div>
//                 <label className="text-xs text-gray-400 tracking-wide">
//                   PHONE NUMBER
//                 </label>
//                 <input
//                   type="tel"
//                   value={form.phone_number}
//                   onChange={(e) =>
//                     setForm((p) => ({ ...p, phone_number: e.target.value }))
//                   }
//                   placeholder="9876543210"
//                   disabled={saving}
//                   className={inputClass(saving)}
//                 />
//               </div>

//               <div>
//                 <label className="text-xs text-gray-400 tracking-wide">
//                   GENDER
//                 </label>
//                 <select
//                   value={form.gender}
//                   onChange={(e) =>
//                     setForm((p) => ({ ...p, gender: e.target.value }))
//                   }
//                   disabled={saving}
//                   className={`${inputClass(saving)} pr-10`}
//                 >
//                   <option value="">Select gender</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="text-xs text-gray-400 tracking-wide">
//                   DATE OF BIRTH
//                 </label>
//                 <input
//                   type="date"
//                   value={form.DOB}
//                   onChange={(e) =>
//                     setForm((p) => ({ ...p, DOB: e.target.value }))
//                   }
//                   disabled={saving}
//                   className={`${inputClass(saving)} appearance-none`}
//                 />
//               </div>
//             </div>
//           ) : (
//             <>
//               <InfoRow
//                 icon={<User size={16} className="text-orange-500" />}
//                 label="FULL NAME"
//                 value={user?.full_name}
//               />
//               <div className="border-t border-gray-200" />
//               <InfoRow
//                 icon={<AtSign size={16} className="text-purple-400" />}
//                 label="USERNAME"
//                 value={user?.username ? `${user.username}` : undefined}
//               />
//               <div className="border-t border-gray-200" />
//               <InfoRow
//                 icon={<Phone size={16} className="text-blue-400" />}
//                 label="PHONE NUMBER"
//                 value={user?.phone_number}
//               />
//               <div className="border-t border-gray-200" />
//               <InfoRow
//                 icon={<Venus size={16} className="text-pink-400" />}
//                 label="GENDER"
//                 value={
//                   user?.gender
//                     ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
//                     : undefined
//                 }
//               />
//               <div className="border-t border-gray-200" />
//               <InfoRow
//                 icon={<Calendar size={16} className="text-green-500" />}
//                 label="DATE OF BIRTH"
//                 value={formatDOB(user?.DOB || "")}
//               />
//             </>
//           )}
//         </div>

//         {/* ── EMAIL CARD ── */}
//         <div className="flex items-center justify-between mb-2">
//           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
//             Email
//           </p>
//           {editMode !== "email" && editMode !== "otp" ? (
//             <button
//               onClick={() => {
//                 setEditMode("email");
//                 setNewEmail("");
//               }}
//               className="text-xs font-semibold text-[#F97316]"
//             >
//               CHANGE
//             </button>
//           ) : (
//             <button
//               onClick={() => {
//                 setEditMode(null);
//                 setNewEmail("");
//                 setOtp("");
//               }}
//               disabled={saving}
//               className="text-xs text-gray-400 disabled:opacity-40"
//             >
//               Cancel
//             </button>
//           )}
//         </div>

//         <div className="bg-gray-100 rounded-2xl overflow-hidden">
//           <InfoRow
//             icon={<Mail size={16} className="text-blue-500" />}
//             label="EMAIL"
//             value={user?.email}
//           />

//           {editMode === "email" && (
//             <div className="px-4 pb-4 space-y-3">
//               <div className="border-t border-gray-200 mb-3" />
//               <div>
//                 <label className="text-xs text-gray-400 tracking-wide">
//                   NEW EMAIL
//                 </label>
//                 <input
//                   type="email"
//                   value={newEmail}
//                   onChange={(e) => setNewEmail(e.target.value)}
//                   placeholder="new@email.com"
//                   disabled={saving}
//                   className={inputClass(saving)}
//                 />
//               </div>
//               <button
//                 onClick={handleRequestEmailOtp}
//                 disabled={saving || !newEmail.trim()}
//                 className="w-full bg-[#1E2A3A] text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
//               >
//                 {saving && <Loader2 size={15} className="animate-spin" />}
//                 Send OTP
//               </button>
//             </div>
//           )}

//           {editMode === "otp" && (
//             <div className="px-4 pb-4 space-y-3">
//               <div className="border-t border-gray-200 mb-3" />
//               <p className="text-xs text-gray-500">
//                 OTP sent to{" "}
//                 <span className="font-semibold text-[#1E2A3A]">
//                   {pendingEmail}
//                 </span>
//               </p>
//               <div>
//                 <label className="text-xs text-gray-400 tracking-wide">
//                   ENTER OTP
//                 </label>
//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   maxLength={6}
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//                   placeholder="123456"
//                   disabled={saving}
//                   className={`${inputClass(saving)} tracking-widest text-center font-bold`}
//                 />
//               </div>
//               <button
//                 onClick={handleVerifyEmailOtp}
//                 disabled={saving || otp.length < 6}
//                 className="w-full bg-[#F97316] text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
//               >
//                 {saving && <Loader2 size={15} className="animate-spin" />}
//                 Verify & Update Email
//               </button>
//               <button
//                 onClick={() => setEditMode("email")}
//                 disabled={saving}
//                 className="w-full text-xs text-gray-400 text-center disabled:opacity-40"
//               >
//                 Change email
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import {
  updateUserDetails,
  requestEmailUpdate,
  verifyEmailUpdate,
} from "@/services/authService";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  AtSign,
  Calendar,
  Venus,
  Check,
  Loader2,
} from "lucide-react";
import { emailSchema } from "@/lib/validators";

type EditField = "details" | "email" | "otp" | null;

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-4">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 tracking-wide">{label}</p>
        <p className="text-sm font-medium text-[#1E2A3A] truncate">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function PersonalInfoPage() {
  const router = useRouter();
  const { user, setUser, setPendingEmail, pendingEmail } = useAuthStore();

  const [editMode, setEditMode] = useState<EditField>(null);
  const [saving, setSaving] = useState(false);

  // ── Initialise form from current user ────────────────────────────────────
  const initialForm = useMemo(
    () => ({
      full_name: user?.full_name || "",
      phone_number: user?.phone_number || "",
      gender: user?.gender || "",
      // DOB is not shown to the user; keep whatever is on the account,
      // or fall back to the same default used at signup (1 Jan 2000)
      DOB: user?.DOB ? user.DOB.split("T")[0] : "2000-01-01",
    }),
    [user],
  );

  const [form, setForm] = useState(initialForm);

  // only show Save when something actually changed
  const isDirty = useMemo(
    () =>
      (Object.keys(form) as (keyof typeof form)[]).some(
        (k) => form[k] !== initialForm[k],
      ),
    [form, initialForm],
  );

  const openEdit = () => {
    setForm(initialForm); // reset to latest saved values every time
    setEditMode("details");
  };

  // ── email update state
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");

  const initials =
    user?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const formatDOB = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ── Save profile details ─────────────────────────────────────────────────
  const handleSaveDetails = async () => {
    setSaving(true);
    try {
      const res = await updateUserDetails({
        full_name: form.full_name,
        phone_number: form.phone_number,
        gender: form.gender,
        // DOB is not editable by the user; send along the default/existing value
        DOB: form.DOB ? new Date(form.DOB).toISOString() : undefined,
      });
      setUser(res.data); // ← was res.data.user
      toast.success("Profile updated");
      setEditMode(null);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // ── Request email OTP ────────────────────────────────────────────────────
  const handleRequestEmailOtp = async () => {
    const email = newEmail.trim();
    if (!email) return toast.error("Enter a new email");

    const result = emailSchema.safeParse(email);
    if (!result.success) return toast.error(result.error.issues[0].message);
    if (email === user?.email)
      return toast.error("New email is same as current email");

    setSaving(true);
    try {
      await requestEmailUpdate(email);
      setPendingEmail(email);
      toast.success("OTP sent to new email");
      setEditMode("otp");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to send OTP");
    } finally {
      setSaving(false);
    }
  };

  // ── Verify OTP ───────────────────────────────────────────────────────────
  const handleVerifyEmailOtp = async () => {
    if (otp.length < 6) return toast.error("Enter the 6-digit OTP");
    setSaving(true);
    try {
      await verifyEmailUpdate({ email: pendingEmail!, otp: otp.trim() });
      setUser((prev) => (prev ? { ...prev, email: pendingEmail! } : prev));
      toast.success("Email updated successfully");
      setEditMode(null);
      setOtp("");
      setNewEmail("");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Invalid OTP");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (disabled: boolean) =>
    `w-full mt-1 h-12 rounded-xl px-4 text-sm outline-none border transition appearance-none
    ${
      disabled
        ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-white border-gray-200 text-[#1E2A3A] focus:border-[#F97316]"
    }`;

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 max-w-md mx-auto">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-base font-bold text-[#1E2A3A]">Personal Info</h1>
        <div className="w-10" />
      </div>

      <div className="max-w-md mx-auto px-4 pb-12">
        {/* AVATAR */}
        <div className="flex flex-col items-center text-center gap-2 py-6">
          <div className="w-20 h-20 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-orange-400">
                {initials}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1E2A3A]">
              {user?.full_name}
            </h2>
            {user?.username && (
              <p className="text-xs text-gray-400">{user.username}</p>
            )}
          </div>
        </div>

        {/* ── DETAILS CARD ── */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Profile Details
          </p>
          {editMode !== "details" ? (
            <button
              onClick={openEdit}
              className="text-xs font-semibold text-[#F97316]"
            >
              EDIT
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditMode(null)}
                disabled={saving}
                className="text-xs text-gray-400 disabled:opacity-40"
              >
                Cancel
              </button>
              {isDirty && (
                <button
                  onClick={handleSaveDetails}
                  disabled={saving}
                  className="text-xs font-semibold text-[#F97316] flex items-center gap-1 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Check size={13} />
                  )}
                  Save
                </button>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 rounded-2xl overflow-hidden mb-4">
          {editMode === "details" ? (
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs text-gray-400 tracking-wide">
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, full_name: e.target.value }))
                  }
                  placeholder="Full name"
                  disabled={saving}
                  className={inputClass(saving)}
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 tracking-wide">
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  value={form.phone_number}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone_number: e.target.value }))
                  }
                  placeholder="9876543210"
                  disabled={saving}
                  className={inputClass(saving)}
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 tracking-wide">
                  GENDER
                </label>
                <select
                  value={form.gender}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, gender: e.target.value }))
                  }
                  disabled={saving}
                  className={`${inputClass(saving)} pr-10`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* DOB — hidden from user, but form.DOB is still sent on save
              <div>
                <label className="text-xs text-gray-400 tracking-wide">
                  DATE OF BIRTH
                </label>
                <input
                  type="date"
                  value={form.DOB}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, DOB: e.target.value }))
                  }
                  disabled={saving}
                  className={`${inputClass(saving)} appearance-none`}
                />
              </div>
              */}
            </div>
          ) : (
            <>
              <InfoRow
                icon={<User size={16} className="text-orange-500" />}
                label="FULL NAME"
                value={user?.full_name}
              />
              <div className="border-t border-gray-200" />
              <InfoRow
                icon={<AtSign size={16} className="text-purple-400" />}
                label="USERNAME"
                value={user?.username ? `${user.username}` : undefined}
              />
              <div className="border-t border-gray-200" />
              <InfoRow
                icon={<Phone size={16} className="text-blue-400" />}
                label="PHONE NUMBER"
                value={user?.phone_number}
              />
              <div className="border-t border-gray-200" />
              <InfoRow
                icon={<Venus size={16} className="text-pink-400" />}
                label="GENDER"
                value={
                  user?.gender
                    ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                    : undefined
                }
              />
              {/* DOB — hidden from user
              <div className="border-t border-gray-200" />
              <InfoRow
                icon={<Calendar size={16} className="text-green-500" />}
                label="DATE OF BIRTH"
                value={formatDOB(user?.DOB || "")}
              />
              */}
            </>
          )}
        </div>

        {/* ── EMAIL CARD ── */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Email
          </p>
          {editMode !== "email" && editMode !== "otp" ? (
            <button
              onClick={() => {
                setEditMode("email");
                setNewEmail("");
              }}
              className="text-xs font-semibold text-[#F97316]"
            >
              CHANGE
            </button>
          ) : (
            <button
              onClick={() => {
                setEditMode(null);
                setNewEmail("");
                setOtp("");
              }}
              disabled={saving}
              className="text-xs text-gray-400 disabled:opacity-40"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="bg-gray-100 rounded-2xl overflow-hidden">
          <InfoRow
            icon={<Mail size={16} className="text-blue-500" />}
            label="EMAIL"
            value={user?.email}
          />

          {editMode === "email" && (
            <div className="px-4 pb-4 space-y-3">
              <div className="border-t border-gray-200 mb-3" />
              <div>
                <label className="text-xs text-gray-400 tracking-wide">
                  NEW EMAIL
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new@email.com"
                  disabled={saving}
                  className={inputClass(saving)}
                />
              </div>
              <button
                onClick={handleRequestEmailOtp}
                disabled={saving || !newEmail.trim()}
                className="w-full bg-[#1E2A3A] text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving && <Loader2 size={15} className="animate-spin" />}
                Send OTP
              </button>
            </div>
          )}

          {editMode === "otp" && (
            <div className="px-4 pb-4 space-y-3">
              <div className="border-t border-gray-200 mb-3" />
              <p className="text-xs text-gray-500">
                OTP sent to{" "}
                <span className="font-semibold text-[#1E2A3A]">
                  {pendingEmail}
                </span>
              </p>
              <div>
                <label className="text-xs text-gray-400 tracking-wide">
                  ENTER OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  disabled={saving}
                  className={`${inputClass(saving)} tracking-widest text-center font-bold`}
                />
              </div>
              <button
                onClick={handleVerifyEmailOtp}
                disabled={saving || otp.length < 6}
                className="w-full bg-[#F97316] text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving && <Loader2 size={15} className="animate-spin" />}
                Verify & Update Email
              </button>
              <button
                onClick={() => setEditMode("email")}
                disabled={saving}
                className="w-full text-xs text-gray-400 text-center disabled:opacity-40"
              >
                Change email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
