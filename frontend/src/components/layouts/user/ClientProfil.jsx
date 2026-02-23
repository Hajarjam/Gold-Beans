import ProfileForm from "../../common/user/ProfileForm";
import PasswordForm from "../../common/user/PasswordForm";
import ClientPicture from "../../common/user/ClientPicture";
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

  if (loading) return <div className="p-8 text-brown">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-peach-light text-brown px-4 py-8 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-instrument-serif mb-6">
          Profile
        </h1>

        {error && (
          <div className="mb-4 rounded bg-red-100 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded bg-green-100 text-green-700 px-4 py-3">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <ProfileForm
              profile={profile}
              onSave={updateProfile}
              saving={saving}
            />
            <PasswordForm onUpdatePassword={updatePassword} saving={saving} />
          </div>

          <ClientPicture
            profilePic={profile?.picture}
            onDeleteAccount={deleteAccount}
            onLogout={logout}
            saving={saving}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
