import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

export default function LogoutButton({ className, children, onBeforeOpen, redirectTo }) {
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleOpen = () => {
    onBeforeOpen?.();
    setShowLogoutAlert(true);
  };

const handleLogoutConfirm = async () => {
  setShowLogoutAlert(false);
  await logout();
  navigate(redirectTo); // fires after state is fully cleared
};

  return (
    <>
      <button type="button" onClick={handleOpen} className={className}>
        {children || "Logout"}
      </button>

      {showLogoutAlert && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-xl bg-[#FFF3EB] text-[#3B170D] p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Logout</h3>
            <p className="mt-2 text-sm text-[#3B170D]/80">
              Are you sure you want to logout?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutAlert(false)}
                className="px-4 py-2 rounded-lg border border-[#3B170D]/30 hover:bg-[#3B170D]/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 rounded-lg bg-[#3B170D] text-[#FFF3EB] hover:bg-[#BB9582] hover:text-[#3B170D] transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
