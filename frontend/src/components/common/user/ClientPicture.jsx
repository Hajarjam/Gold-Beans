import { useEffect, useMemo, useState } from "react";
import { FaCamera, FaUser } from "react-icons/fa";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const getApiOrigin = () => {
  if (!API_BASE_URL) return "";
  return API_BASE_URL.replace(/\/api\/?$/, "");
};

const getFirstNonEmptyString = (...values) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

const getImagePathFromProfile = (profile) =>
  getFirstNonEmptyString(
    profile?.profileImage,
    profile?.profilePic,
    profile?.profilePicture,
    profile?.avatar,
    profile?.avatarUrl,
    profile?.image,
    profile?.imageUrl,
    profile?.photo,
    profile?.photoUrl,
    profile?.picture,
  );

const buildImageCandidates = (imagePath) => {
  if (!imagePath) return [];
  if (
    /^https?:\/\//i.test(imagePath) ||
    /^data:/i.test(imagePath) ||
    /^blob:/i.test(imagePath)
  ) {
    return [imagePath];
  }

  const apiOrigin = getApiOrigin();
  const trimmed = imagePath.trim();
  if (!trimmed) return [];

  const paths = new Set();
  if (trimmed.startsWith("/")) {
    paths.add(trimmed);
  } else {
    paths.add(`/${trimmed}`);
    if (!trimmed.startsWith("uploads/")) {
      paths.add(`/uploads/${trimmed}`);
      if (!trimmed.includes("/")) {
        paths.add(`/uploads/avatars/${trimmed}`);
      }
    }
  }

  const basePaths = Array.from(paths);
  if (!apiOrigin) return basePaths;

  return Array.from(
    new Set([
      ...basePaths.map((path) => `${apiOrigin}${path}`),
      ...basePaths,
      trimmed,
    ]),
  );
};

const getInitials = (firstName, lastName) => {
  const first = String(firstName || "").trim();
  const last = String(lastName || "").trim();
  const initials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase().trim();
  return initials || "";
};

const ProfileDetail = ({ label, value, breakWords = false }) => (
  <div className="bg-peach/30 rounded-lg px-3 py-2">
    <p className="text-xs uppercase tracking-wide text-brown/65">{label}</p>
    <p className={`text-sm font-medium ${breakWords ? "break-all" : ""}`}>
      {value}
    </p>
  </div>
);

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not preview image"));
    };
    reader.onerror = () => reject(new Error("Could not preview image"));
    reader.readAsDataURL(file);
  });

const ClientPicture = ({ profile, onUploadAvatar, uploadingAvatar = false }) => {
  const fullName = `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim();
  const initials = getInitials(profile?.firstName, profile?.lastName);
  const fallbackName = fullName || "Client";
  const canUpload = typeof onUploadAvatar === "function";

  const [previewSrc, setPreviewSrc] = useState("");

  const imageCandidates = useMemo(() => {
    const profileCandidates = buildImageCandidates(getImagePathFromProfile(profile));
    return previewSrc ? [previewSrc, ...profileCandidates] : profileCandidates;
  }, [profile, previewSrc]);

  const imageCandidatesKey = useMemo(
    () => imageCandidates.join("|"),
    [imageCandidates],
  );

  const [imageIndex, setImageIndex] = useState(0);
  useEffect(() => {
    setImageIndex(0);
  }, [imageCandidatesKey]);

  const profileImageSrc = imageCandidates[imageIndex] || "";

  const handleImageError = () => {
    setImageIndex((prev) =>
      prev + 1 < imageCandidates.length ? prev + 1 : imageCandidates.length,
    );
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !canUpload || uploadingAvatar) return;

    try {
      const preview = await readFileAsDataUrl(file);
      setPreviewSrc(preview);
      await onUploadAvatar(file);
      setPreviewSrc("");
    } catch (_error) {
      setPreviewSrc("");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <section className="bg-peach/40 text-brown rounded-lg shadow-md p-6">
      <h2 className="md:text-xl font-semibold font-instrument-sans mb-4">
        Profile Overview
      </h2>

      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex justify-center md:justify-start">
          <div className="flex flex-col items-center gap-3">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-brown/70 bg-peach-light flex items-center justify-center">
              {profileImageSrc ? (
                <img
                  src={profileImageSrc}
                  alt={`${fallbackName} profile`}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              ) : initials ? (
                <span className="text-2xl font-semibold text-brown">{initials}</span>
              ) : (
                <FaUser className="w-8 h-8 text-brown/60" aria-hidden="true" />
              )}
            </div>

            {canUpload ? (
              <>
                <label
                  htmlFor="client-avatar-upload"
                  className={`inline-flex items-center gap-2 rounded px-3 py-2 text-sm transition-colors ${
                    uploadingAvatar
                      ? "bg-brown/50 text-white cursor-not-allowed"
                      : "bg-brown text-white hover:bg-charcoal cursor-pointer"
                  }`}
                >
                  <FaCamera className="w-4 h-4" />
                  {uploadingAvatar ? "Uploading..." : "Upload Photo"}
                </label>
                <input
                  id="client-avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
              </>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <ProfileDetail label="Full Name" value={fallbackName} />
          <ProfileDetail
            label="Email"
            value={profile?.email || "Not provided"}
            breakWords
          />
          <ProfileDetail
            label="Phone"
            value={profile?.phone || "Not provided"}
          />
          <ProfileDetail label="Role" value={profile?.role || "client"} />
        </div>
      </div>
    </section>
  );
};

export default ClientPicture;
