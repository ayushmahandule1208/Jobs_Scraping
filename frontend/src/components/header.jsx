import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  HomeIcon,
  SearchIcon,
  UserIcon,
  ArrowDownIcon,
  MessageSquareIcon,
  UserCircleIcon,
  LogOutIcon,
  SunIcon,
  MoonIcon,
  BellIcon,
} from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Local Auth State
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    // Implement logout logic (clear tokens, session, etc.)
    setIsAuthenticated(false);
  };

  return (
    <>
      <nav className="py-1 px-6 flex justify-between items-center fixed top-0 left-0 w-full z-50 bg-gray-800 backdrop-blur-md shadow-lg">
        <Link to="/" className="flex items-center gap-5">
          <img src="/logo.png" className="h-20 w-auto" alt="Logo" />
          <span className="text-white font-semibold text-lg">CDSS</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-base font-medium text-white">
          {[ 
            { name: "Home", icon: <HomeIcon size={16} />, path: "/" },
            { name: "Patients", icon: <SearchIcon size={16} />, path: "/patients" },
            { name: "AI Insights", icon: <MessageSquareIcon size={16} />, path: "/ai-insights" },
            { name: "Reports", icon: <BellIcon size={16} />, path: "/reports" },
            { name: "Alerts", icon: <BellIcon size={16} />, path: "/alerts" },
          ].map(({ name, icon, path }, index) => (
            <Link
              key={index}
              to={path}
              className="relative flex items-center gap-2 text-gray-200 hover:text-blue-400 transition-all duration-300 py-2"
            >
              {icon} {name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            {isAuthenticated && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button className="text-white" onClick={toggleDarkMode}>
                    {darkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
                  </button>
                </div>
                <button className="text-white" onClick={() => setMenuOpen(!menuOpen)}>
                  <UserCircleIcon size={20} />
                </button>
                <div
                  className={`absolute right-0 mt-2 bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-md ${
                    menuOpen ? "block" : "hidden"
                  }`}
                >
                  <Link
                    to="/profile"
                    className="block text-gray-200 hover:text-blue-400 py-2"
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block text-gray-200 hover:text-blue-400 py-2"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block text-red-400 hover:text-red-600 py-2"
                  >
                    <LogOutIcon size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-all duration-300"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-64 h-full bg-gray-900/95 border-l border-gray-800 
                     flex flex-col gap-4 p-6 transform transition-all duration-300 ease-out"
          >
            {[ 
              { name: "Home", icon: <HomeIcon size={16} />, path: "/" },
              { name: "Patients", icon: <SearchIcon size={16} />, path: "/patients" },
              { name: "AI Insights", icon: <MessageSquareIcon size={16} />, path: "/ai-insights" },
              { name: "Reports", icon: <BellIcon size={16} />, path: "/reports" },
              { name: "Alerts", icon: <BellIcon size={16} />, path: "/alerts" },
            ].map(({ name, icon, path }, index) => (
              <Link
                key={index}
                to={path}
                className="flex items-center gap-3 text-gray-200 hover:text-blue-400 transition-all duration-300 py-2 border-b border-gray-800/50"
              >
                {icon} {name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
