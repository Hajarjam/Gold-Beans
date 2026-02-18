import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function NavbarC() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);

    const menuItems = ["Home", "About", "Services", "Contact"];

    const navigate = useNavigate();

    const logout = () => {
        const ok = window.confirm("Are you sure you want to logout?");
        if (!ok) return;

        localStorage.removeItem("token"); // Supprime le token du localStorage // l’utilisateur n’est plus considéré comme connecté // ProtectedRoute bloque l’accès
        navigate("/");
    };

    return (



        <nav className="absolute top-0 left-0 w-full z-50 bg-transparent text-white px-4 sm:px-8 py-4 flex justify-between items-center">
            {/* Logo */}
            <div onClick={()=>navigate('/')} className="w-12 h-16 cursor-pointer">
                <img
                    src="/assets/logo.png"
                    alt="logo"
                    className="w-full h-full object-contain"
                />
            </div>


            <div className="hidden md:flex gap-6 lg:gap-8 ml-auto">
                {menuItems.map((item) => (
                    <div
                        key={item}
                        className="hover:text-peach cursor-pointer font-instrument-sans transition"
                    >
                        {item}
                    </div>
                ))}
            </div>

            {/* Desktop buttons */}
            <div className="hidden md:flex items-center gap-3 ml-8">

                {/* Bouton Logout */}
                <button
                    onClick={() => setShowLogoutAlert(true)}
                    className="px-4 py-2 h-10 border border-white text-white rounded-lg hover:bg-peach hover:border-peach hover:text-black font-instrument-sans transition inline-flex items-center justify-center"
                >
                    Logout
                </button>

                <Link
                    to="/profile"
                    className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white/20 transition"
                    title="Profile"
                >
                    <svg
                        className="w-5 h-5 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 12c2.7 0 4.5-2.1 4.5-4.5S14.7 3 12 3 7.5 5.1 7.5 7.5 9.3 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5C21 15.5 15 14 12 14z" />
                    </svg>
                </Link>



                <Link
                    to="/cart"
                    className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white/20 transition"
                    title="Cart"
                >
                    <svg
                        className="w-5 h-5 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.2 6l.3 2h10.9c.6 0 1.1.4 1.2 1l.9 5.1c.1.7-.4 1.4-1.2 1.4H8.1c-.6 0-1.1-.4-1.2-1L5.3 4H3V2h3.1c.6 0 1.1.4 1.2 1l.3 1H21v2H7.2z" />
                    </svg>
                </Link>




            </div>


            {/* Mobile menu button */}
            <div className="md:hidden">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="focus:outline-none"
                >
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-stone-900/80 flex flex-col items-center gap-4 py-4 md:hidden">
                    {menuItems.map((item) => (
                        <div
                            key={item}
                            className="text-white hover:text-gray-300 cursor-pointer transition"
                        >
                            {item}
                        </div>
                    ))}
                    <button className="w-3/4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition">
                        Login
                    </button>
                    <button className="w-3/4 px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-black transition">
                        Sign Up
                    </button>
                </div>
            )}
            {showLogoutAlert && (
                <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center px-4">
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
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    setShowLogoutAlert(false);
                                    navigate("/");
                                }}
                                className="px-4 py-2 rounded-lg bg-[#3B170D] text-[#FFF3EB] hover:bg-[#BB9582] hover:text-[#3B170D] transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </nav>
    );
}
