import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import CartContext from "../../contexts/CartContext";
import LogoutButton from "../common/LogoutButton";

export default function DarkNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { items } = useContext(CartContext);
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

  const menuItems = [
    { name: "Our coffee", link: "/coffees" },
    { name: "Our machines", link: "/machines" },
    { name: "Subscribe", link: "#" },
  ];

  return (
    <nav className="absolute top-0 left-0 w-full z-50 text-black px-4 sm:px-8 py-2 flex justify-between items-center">
      {/* Logo */}
      <div onClick={() => navigate("/")} className="w-12 h-16 cursor-pointer">
        <img src="/assets/logo2.png" alt="logo" className="w-full h-full object-contain" />
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex gap-6 lg:gap-8 ml-auto">
        {menuItems.map((item) => (
          <div key={item.name} className="hover:text-peach cursor-pointer font-instrument-sans transition">
            {item.link.startsWith("/") ? (
              <Link to={item.link}>{item.name}</Link>
            ) : (
              <a href={item.link}>{item.name}</a>
            )}
          </div>
        ))}
      </div>

      {/* Desktop buttons */}
      <div className="hidden md:flex items-center gap-3 ml-8">
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="px-6 py-2 bg-brown text-white rounded-lg hover:bg-peach hover:text-brown font-instrument-sans transition inline-flex items-center justify-center"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 h-10 border border-brown text-brown rounded-lg hover:bg-brown hover:text-white font-instrument-sans transition inline-flex items-center justify-center"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <LogoutButton
              redirectTo="/"
              className="px-4 py-2 h-10 border border-brown text-brown rounded-lg hover:bg-brown hover:text-white font-instrument-sans transition inline-flex items-center justify-center"
            />
            <Link
              to="/client/dashboard"
              className="w-10 h-10 rounded-full border border-brown flex items-center justify-center hover:bg-brown/20 transition"
              title="Dashboard"
            >
              <svg className="w-5 h-5 text-brown" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </Link>
            <Link
              to="/client/cart"
              className="relative w-10 h-10 rounded-full border border-brown flex items-center justify-center hover:bg-brown/20 transition"
              title="Cart"
            >
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-brown text-white text-[10px] font-semibold leading-none flex items-center justify-center">
                  {totalQty > 99 ? "99+" : totalQty}
                </span>
              )}
              <svg className="w-5 h-5 text-brown" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.2 6l.3 2h10.9c.6 0 1.1.4 1.2 1l.9 5.1c.1.7-.4 1.4-1.2 1.4H8.1c-.6 0-1.1-.4-1.2-1L5.3 4H3V2h3.1c.6 0 1.1.4 1.2 1l.3 1H21v2H7.2z" />
              </svg>
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="focus:outline-none">
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-peach-light/95 flex flex-col items-center gap-4 py-4 md:hidden">
          {menuItems.map((item) => (
            <div key={item.name} className="text-black hover:text-brown cursor-pointer transition">
              {item.link.startsWith("/") ? (
                <Link to={item.link}>{item.name}</Link>
              ) : (
                <a href={item.link}>{item.name}</a>
              )}
            </div>
          ))}
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="w-3/4 px-4 py-2 bg-brown text-white rounded-lg hover:bg-peach-dark transition text-center">
                Log In
              </Link>
              <Link to="/register" className="w-3/4 px-4 py-2 border border-brown text-brown rounded-lg hover:bg-brown hover:text-white transition text-center">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <LogoutButton
                redirectTo="/"
                onBeforeOpen={() => setMobileMenuOpen(false)}
                className="w-3/4 px-4 py-2 bg-brown text-white rounded-lg hover:bg-peach-dark transition text-center"
              />
              <Link to="/client/dashboard" className="w-3/4 px-4 py-2 bg-brown text-white rounded-lg hover:bg-peach-dark transition text-center">
                Dashboard
              </Link>
              <Link to="/client/cart" className="w-3/4 px-4 py-2 bg-brown text-white rounded-lg hover:bg-peach-dark transition text-center">
                Cart
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
