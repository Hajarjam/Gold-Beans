import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function DarkNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  /* const menuItems = ["Our coffee", "About Us", "Subscribe"]; */
     const navigate = useNavigate();
  const menuItems =[{
    name:"Our coffee",
    link: "/coffees"
  },{
    name:"About Us",
    link:"#"
  },{
    name:"Subscribe",
    link:"#"
  }
]
  return (
    <nav className="absolute top-0 left-0 w-full z-50 text-black px-4 sm:px-8 py-2 flex justify-between items-center">
      {/* Logo */}
      <div onClick={()=>navigate('/')} className="w-12 h-16 cursor-pointer ">
        <img
          src="/assets/logo2.png"
          alt="logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex gap-6 lg:gap-8 ml-auto">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className="hover:text-peach cursor-pointer font-instrument-sans transition"
          >
            <a href={item.link}>{item.name}</a>
          </div>
        ))}
      </div>

      {/* Desktop buttons */}
      <div className="hidden md:flex gap-3 ml-8">
        <Link
          to="/Login"
          className="px-6 py-2 bg-brown text-white rounded-lg hover:bg-peach hover:text-brown font-instrument-sans transition inline-flex items-center justify-center"
        >
          Log In
        </Link>

        <Link
          to="/Signup"
          className="px-4 py-2 h-10 border border-brown text-brown rounded-lg hover:bg-brown hover:text-white font-instrument-sans transition inline-flex items-center justify-center"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="focus:outline-none"
        >
          <svg
            className="w-6 h-6 text-black"
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
        <div className="absolute top-full left-0 w-full bg-peach-light/95 flex flex-col items-center gap-4 py-4 md:hidden">
          {menuItems.map((item) => (
            <div
              key={item}
              className="text-black hover:text-brown cursor-pointer transition"
            >
              {item}
            </div>
          ))}

          <Link
            to="/Login"
            className="w-3/4 px-4 py-2 bg-brown text-white rounded-lg hover:bg-peach-dark transition text-center"
          >
            Log In
          </Link>
          <Link
            to="/Signup"
            className="w-3/4 px-4 py-2 border border-brown text-brown rounded-lg hover:bg-brown hover:text-white transition text-center"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
