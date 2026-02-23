import { useState } from "react";
import { FaCamera } from "react-icons/fa";

const ClientPicture = ({ profilePic, onDeleteAccount, onLogout, saving }) => {
  const [profileImage, setProfileImage] = useState(profilePic || null);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col items-center gap-6">
      <div className="bg-peach/30 rounded-lg p-6 flex flex-col items-center">
        <div className="relative w-40 h-40 mb-4 rounded-full overflow-hidden border-4 border-brown">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-peach text-center">No Image</span>
          )}
          <label
            htmlFor="profile-upload"
            className="absolute bottom-2 right-2 bg-brown text-peach-light p-3 rounded-full cursor-pointer hover:bg-charcoal transition-colors"
          >
            <FaCamera className="w-5 h-5" />
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      <button
        type="submit"
        className={`w-full py-3 rounded-lg font-serif text-lg transition-colors ${
          saved
            ? "bg-green-700 text-white"
            : "bg-brown text-peach-light hover:bg-charcoal"
        }`}
      >
        {saved ? "Saved!" : "Save "}
      </button>

      <button
        type="button"
        onClick={onLogout}
        className="w-full rounded bg-brown text-peach py-2 hover:bg-brown/40 focus:outline-none focus:ring-2 focus:ring-peach-light"
      >
        Logout
      </button>

      <button
        type="button"
        onClick={onDeleteAccount}
        disabled={saving}
        className="w-full rounded border border-red-600 text-red-700 py-2 hover:bg-red-50 disabled:opacity-60"
      >
        Delete Account
      </button>
    </form>
  );
};

export default ClientPicture;
