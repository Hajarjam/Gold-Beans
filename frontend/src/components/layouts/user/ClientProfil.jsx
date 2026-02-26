import { useState } from "react";
import { createPortal } from "react-dom";
import ProfileForm from "../../common/user/ProfileForm";
import PasswordForm from "../../common/user/PasswordForm";
import { useClientProfile } from "../../common/user/useClientProfile";
import ClientPicture from "../../common/user/ClientPicture";

const ClientProfile = () => {
  const {
    profile,
    loading,
    saving,
    avatarUploading,
    error,
    message,
    updateProfile,
    uploadAvatar,
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
    return (
      <div className="flex flex-col w-full min-h-screen bg-peach-light text-brown pt-8">
        <div className="px-4 pb-6">
          <p className="text-sm text-brown/70">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-peach-light text-brown pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 pb-6">
        <div className="lg:col-span-2 space-y-3">
          <h1 className="md:text-2xl font-semibold font-instrument-sans mb-1">
          Profile
          </h1>

          {error && (
            <div className="rounded-lg border border-red-300 bg-red-100 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-lg border border-green-300 bg-green-100 text-green-700 px-4 py-3 text-sm">
              {message}
            </div>
          )}
            <ClientPicture
              profile={profile}
              onUploadAvatar={uploadAvatar}
              uploadingAvatar={avatarUploading}
            />
            <ProfileForm profile={profile} onSave={updateProfile} saving={saving} />

            <PasswordForm onUpdatePassword={updatePassword} saving={saving} />
        </div>

          <section className="bg-peach/40 text-brown rounded-lg shadow-md p-6 h-fit mt-10">
            <h2 className="md:text-xl font-semibold font-instrument-sans mb-2">
              Account Actions
            </h2>
            <div className="space-y-3">
              <button
                type="button"
                onClick={logout}
                className="w-full rounded bg-brown text-white py-2 hover:bg-white hover:text-brown focus:outline-none focus:ring-2 focus:ring-peach-light transition-colors"
              >
                Logout
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => setConfirmDeleteOpen(true)}
                className="w-full rounded border border-red-600 text-red-700 py-2 hover:bg-red-50 disabled:opacity-60 transition-colors"
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

export default ClientProfile;
