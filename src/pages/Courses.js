// src/pages/Courses.js
import React from "react";
import { Link } from "react-router-dom";

export default function Courses() {
  const categories = [
    {
      id: "cybersecurity-fundamentals",
      title: "Cybersecurity Fundamentals",
      desc: "Start from zero and build strong foundational cybersecurity skills.",
      color: "border-green-400",
    },
    {
      id: "penetration-testing",
      title: "Penetration Testing & Red Teaming",
      desc: "Hands-on offensive security and real-world attack simulation.",
      color: "border-red-500",
    },
    {
      id: "ethical-hacking",
      title: "Ethical Hacking (CEH Track)",
      desc: "Master practical hacking and prepare for CEH certification.",
      color: "border-blue-400",
    },
    {
      id: "soc-blue-team",
      title: "SOC / Blue Team Defense",
      desc: "Learn SIEM monitoring, threat detection, and incident response.",
      color: "border-yellow-400",
    },
    {
      id: "forensics-malware",
      title: "Forensics & Malware Analysis",
      desc: "Deep dive digital forensics, reverse engineering & malware labs.",
      color: "border-purple-500",
    },
    {
      id: "osint-intelligence",
      title: "OSINT & Cyber Intelligence",
      desc: "Learn reconnaissance, intelligence gathering & investigation.",
      color: "border-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 pt-32 px-6">
      <h1 className="text-4xl font-bold text-center">Cybersecurity Courses</h1>
      <p className="text-center text-green-300 mt-4 max-w-3xl mx-auto">
        Master cybersecurity skills through hands-on labs, real attacks,
        simulated environments, and guided career paths.
      </p>

      {/* Course Categories */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {categories.map((course) => (
          <div
            key={course.id}
            className={`bg-gray-900 border ${course.color} p-6 rounded-2xl hover:scale-105 shadow-lg transition duration-150`}
          >
            <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
            <p className="text-green-300 mb-4">{course.desc}</p>

            <Link
              to={`/courses/${course.id}`}
              className="block bg-green-500 text-black font-bold text-center py-2 rounded-lg hover:bg-green-400"
            >
              View Course
            </Link>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center mt-12">
        <Link
          to="/compare-packages"
          className="inline-block bg-green-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-green-400"
        >
          Compare Training Packages
        </Link>
      </div>
    </div>
  );
}
