// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo/cyberpinnacle-logo.jpg";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [articlesOpen, setArticlesOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Persist theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  const username =
    user?.displayName || (user?.email ? user.email.split("@")[0] : "");
  const initials = username ? username[0].toUpperCase() : "A";

  const isActive = (path) =>
    location.pathname === path
      ? "text-green-300"
      : "text-green-400 hover:text-green-300";

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/95 dark:bg-black backdrop-blur-xl border-b border-green-500/60 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={logo}
            alt="CyberPinnacle"
            className="w-10 h-10 rounded-md border border-green-500"
          />
          <span className="text-green-400 font-extrabold text-lg">
            CyberPinnacle
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className={isActive("/")}>Home</Link>
          <Link to="/about" className={isActive("/about")}>About</Link>
          <Link to="/projects" className={isActive("/projects")}>Projects</Link>
          <Link to="/ctf" className={isActive("/ctf")}>CTF</Link>
          <Link to="/leaderboard" className={isActive("/leaderboard")}>Leaderboard</Link>
          <Link to="/courses" className={isActive("/courses")}>Courses</Link>

          {/* Articles */}
          <div
            className="relative"
            onMouseEnter={() => setArticlesOpen(true)}
            onMouseLeave={() => setArticlesOpen(false)}
          >
            <button className="text-green-400 hover:text-green-300">
              Articles ▾
            </button>

            {articlesOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-black border border-green-500 rounded-xl p-4 space-y-2 shadow-xl">
                {[
                  "ip-camera-hacking",
                  "bluetooth-hacking",
                  "wifi-hacking",
                  "osint",
                  "bug-bounty",
                  "mrrobot",
                  "malware",
                  "linux",
                ].map((slug) => (
                  <Link
                    key={slug}
                    to={`/articles/${slug}`}
                    className="block hover:text-green-300"
                  >
                    {slug.replace("-", " ").toUpperCase()}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/ai" className={isActive("/ai")}>AI Assistant</Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-green-400 border border-green-500 px-2 py-1 rounded"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          {/* User */}
          {user ? (
            <div className="relative group ml-2">
              <button className="flex items-center gap-2 text-green-300">
                <div className="w-8 h-8 rounded-full border border-green-400 flex items-center justify-center">
                  {initials}
                </div>
                <span className="text-xs">{username}</span>
              </button>

              <div className="absolute right-0 mt-2 bg-black border border-green-500 rounded-xl p-3 w-52 opacity-0 group-hover:opacity-100 transition">
                <Link to="/dashboard" className="block py-1 hover:text-green-300">Dashboard</Link>
                <Link to="/profile" className="block py-1 hover:text-green-300">Profile</Link>

                {user.email === "cyberpinnacle7@gmail.com" && (
                  <Link to="/admin" className="block py-1 text-amber-300">
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="mt-2 text-red-400 text-left w-full"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-green-500 text-black px-4 py-1.5 rounded font-semibold"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-green-400 text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-green-500 px-6 py-4 space-y-4 text-green-300">
          {[
            ["/", "Home"],
            ["/about", "About"],
            ["/projects", "Projects"],
            ["/ctf", "CTF"],
            ["/leaderboard", "Leaderboard"],
            ["/courses", "Courses"],
            ["/ai", "AI Assistant"],
          ].map(([path, label]) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className="block"
            >
              {label}
            </Link>
          ))}

          <button onClick={toggleTheme} className="block">
            Toggle Theme
          </button>

          {user ? (
            <button onClick={logout} className="text-red-400">
              Logout
            </button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
