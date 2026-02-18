import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();


 const menuItems =[{
    name:"Our coffee",
    link: "/coffees"
  },
  {
    name:"About Us",
    link:"#"
  },{
    name:"Subscribe",
    link:"#"
  }
]
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
          to="/login"
          className="px-6 py-2 bg-white text-black rounded-lg hover:bg-peach font-instrument-sans transition inline-flex items-center justify-center"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="px-4 py-2 h-10 border border-white text-white rounded-lg hover:bg-peach hover:border-peach hover:text-black font-instrument-sans transition inline-flex items-center justify-center"
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
    </nav>
  );
}
