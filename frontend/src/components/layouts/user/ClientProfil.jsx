import { useState } from "react";
import { createPortal } from "react-dom";
import ProfileForm from "../../common/user/ProfileForm";
import PasswordForm from "../../common/user/PasswordForm";
import { useClientProfile } from "../../common/user/useClientProfile";

const ClientProfile = () => {
  const {
    profile,
    loading,
    saving,
    error,
    message,
    updateProfile,
    updatePassword,
    deleteAccount,
    logout,
  } = useClientProfile();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const closeDeleteModal = () => {
    if (saving) return;
    setConfirmDeleteOpen(false);
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    setConfirmDeleteOpen(false);
  };

  if (loading) {
    return <div className="py-4 text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="text-gray-800">
      <h1 className="text-2xl font-semibold mb-8">Profile</h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-100 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-100 text-green-700 px-4 py-3 text-sm">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <section className="rounded-lg bg-white border border-[#EADFD7] shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Current Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              label="First Name"
              value={profile?.firstName || "Not provided"}
            />
            <InfoItem
              label="Last Name"
              value={profile?.lastName || "Not provided"}
            />
            <InfoItem label="Email" value={profile?.email || "Not provided"} />
            <InfoItem
              label="Phone Number"
              value={profile?.phone || "Not provided"}
            />
          </div>
        </section>

        <ProfileForm profile={profile} onSave={updateProfile} saving={saving} />

        <PasswordForm onUpdatePassword={updatePassword} saving={saving} />

        <section className="rounded-lg bg-white border border-[#EADFD7] shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-[#3B170D] text-[#FFF3EB] hover:bg-[#BB9582] hover:text-[#3B170D] transition"
            >
              Logout
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => setConfirmDeleteOpen(true)}
              className="px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>

      {confirmDeleteOpen && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4">
              <div className="w-full max-w-sm rounded-xl bg-[#FFF3EB] text-[#3B170D] p-6 shadow-xl">
                <h3 className="text-lg font-semibold">Delete Account</h3>
                <p className="mt-2 text-sm text-[#3B170D]/80">
                  Are you sure you want to delete your account?
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={closeDeleteModal}
                    className="px-4 py-2 rounded-lg border border-[#3B170D]/30 hover:bg-[#3B170D]/5 transition"
                  >
                    Dismiss
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 rounded-lg bg-[#3B170D] text-[#FFF3EB] hover:bg-[#BB9582] hover:text-[#3B170D] transition"
                  >
                    {saving ? "Deleting..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="rounded-xl border border-[#EADFD7] bg-[#FDF9F5] px-3 py-2.5">
    <p className="text-xs uppercase tracking-wide text-[#3B170D]/60">{label}</p>
    <p className="mt-1 text-sm font-medium text-[#3B170D]">{value}</p>
  </div>
);

export default ClientProfile;
