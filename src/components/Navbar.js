import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo/cyberpinnacle-logo.jpg";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [articlesOpen, setArticlesOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/90 backdrop-blur-lg border-b border-green-400 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} alt="CyberPinnacle" className="w-12 h-12 rounded-md" />
          <span className="text-green-400 text-xl font-bold">CyberPinnacle</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-green-400 font-semibold">
          <Link to="/" className="hover:text-green-300">Home</Link>
          <Link to="/about" className="hover:text-green-300">About</Link>
          <Link to="/team" className="hover:text-green-300">Team</Link>
          <Link to="/projects" className="hover:text-green-300">Projects</Link>
          <Link to="/contact" className="hover:text-green-300">Contact</Link>
          <Link to="/ctf" className="hover:text-green-300">CTF</Link>
          <Link to="/leaderboard" className="hover:text-green-300">Leaderboard</Link>
          <Link to="/courses" className="hover:text-green-300">Courses</Link>

          {/* Training Dropdown */}
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setTrainingOpen(true)}
            onMouseLeave={() => setTrainingOpen(false)}
          >
            <span className="hover:text-green-300">Training ▾</span>

            {trainingOpen && (
              <div className="absolute top-6 left-0 bg-black border border-green-400 rounded-lg p-3 space-y-2 w-56">
                <Link to="/training-packages" className="hover:text-green-300 block">Training Packages</Link>
                <Link to="/career-training" className="hover:text-green-300 block">Career Training</Link>
              </div>
            )}
          </div>

          {/* Articles Dropdown */}
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setArticlesOpen(true)}
            onMouseLeave={() => setArticlesOpen(false)}
          >
            <span className="hover:text-green-300">Articles ▾</span>

            {articlesOpen && (
              <div className="absolute top-6 left-0 bg-black border border-green-400 rounded-lg p-3 grid grid-cols-1 gap-2 w-64">
                <Link to="/articles/wifi-hacking" className="hover:text-green-300 block">Wi-Fi Hacking</Link>
                <Link to="/articles/malware" className="hover:text-green-300 block">Malware Analysis</Link>
              </div>
            )}
          </div>

          <Link to="/ai" className="hover:text-green-300">AI Assistant</Link>

          {user ? (
            <div className="relative group">
              <button className="text-green-400 font-semibold">
                Hello, {user.email} ▼
              </button>
              <div className="absolute right-0 mt-2 bg-black border border-green-400 rounded-lg p-3 w-48 opacity-0 group-hover:opacity-100 transition">
                <Link to="/dashboard" className="block hover:text-green-300">Dashboard</Link>
                <button onClick={logout} className="text-left w-full hover:text-red-300 mt-1">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-green-500 text-black px-4 py-1 rounded-lg hover:bg-green-400">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-green-400 text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Slide Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 border-t border-green-500 text-green-300 px-6 py-4 space-y-4 animate-slideDown">
          <Link to="/" className="block text-lg font-semibold" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" className="block" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/courses" className="block" onClick={() => setMenuOpen(false)}>Courses</Link>
          <Link to="/leaderboard" className="block" onClick={() => setMenuOpen(false)}>Leaderboard</Link>

          <details>
            <summary className="cursor-pointer font-semibold">Training</summary>
            <div className="ml-3 mt-2 space-y-2 text-sm">
              <Link to="/training-packages" className="block">Training Packages</Link>
              <Link to="/career-training" className="block">Career Training</Link>
            </div>
          </details>

          <details>
            <summary className="cursor-pointer font-semibold">Articles</summary>
            <div className="ml-3 mt-2 space-y-2 text-sm">
              <Link to="/articles/wifi-hacking" className="block">Wi-Fi Hacking</Link>
              <Link to="/articles/malware" className="block">Malware Analysis</Link>
            </div>
          </details>

          <Link to="/ai" className="block text-lg">AI Assistant</Link>
          <Link to="/dashboard" className="block text-lg">Dashboard</Link>

          <button
            onClick={logout}
            className="w-full bg-red-600 text-black py-2 rounded-lg font-bold mt-4"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
