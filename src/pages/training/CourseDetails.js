// src/pages/training/CourseDetails.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PaymentButton from "../../components/PaymentButton";

export default function CourseDetails() {
  const { courseId } = useParams();
  const { user } = useAuth();

  // Simple course lookup – you can add more later
  const courses = {
    "ethical-hacking": {
      id: "ethical-hacking",
      title: "Ethical Hacking & Penetration Testing",
      description:
        "Learn real-world Ethical Hacking techniques, web exploitation, wireless attacks, OSINT, privilege escalation, and full Red Team methodologies with hands-on labs and CTF challenges.",
      difficulty: "Intermediate",
      duration: "6 Weeks",
      level: "Career Training",
      instructor: "Abdul-Roheem Abdul-Razaq (Sayfullah)",
      // 🔁 Replace this with your real cyber-themed preview later
      videoURL: "https://www.w3schools.com/html/mov_bbb.mp4",
      price: 15000, // NGN
      modules: [
        "Introduction to Ethical Hacking & Lab Setup",
        "Information Gathering & OSINT",
        "Scanning & Enumeration Techniques",
        "Exploitation Fundamentals",
        "Web Application Exploitation",
        "Metasploit Framework",
        "Wireless Hacking",
        "Post-Exploitation & Privilege Escalation",
        "CTF Challenges & Practical Projects",
      ],
      freePreviewCount: 2, // first 2 modules are free preview
      requirements: [
        "Basic computer usage",
        "No prior coding required",
        "Laptop with 8GB RAM recommended",
        "Curiosity and willingness to learn",
      ],
      outcomes: [
        "Master real-world hacking skills",
        "Become job-ready for cybersecurity roles",
        "Build a professional hacking portfolio",
        "Perform penetration testing legally",
        "Prepare for security certifications",
      ],
    },
  };

  const course =
    courses[courseId] ||
    courses["ethical-hacking"]; // fallback if route is wrong

  const [modulesOpen, setModulesOpen] = useState(true);

  const handlePaymentSuccess = (reference) => {
    console.log("Payment success:", reference);
    alert("✅ Payment successful! You now have full access to this course.");
    // Later: call backend to mark course as purchased for this user
  };

  const handlePaymentClose = () => {
    console.log("Payment closed");
  };

  return (
    <div className="min-h-screen bg-black text-green-400 pt-32 px-6 pb-16">
      {/* Video Preview */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="relative rounded-xl border border-green-500 overflow-hidden">
          <video controls className="w-full">
            <source src={course.videoURL} type="video/mp4" />
          </video>
          <div className="absolute top-3 left-3 bg-black/70 px-3 py-1 rounded-full text-xs border border-green-400">
            Course Preview
          </div>
        </div>
      </div>

      {/* Course Title & Description */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        {course.title}
      </h1>
      <p className="text-green-300 text-center max-w-3xl mx-auto mb-8 text-sm md:text-base">
        {course.description}
      </p>

      {/* Meta Badges */}
      <div className="flex flex-wrap justify-center gap-3 mb-10 text-xs md:text-sm">
        <span className="border border-green-500 px-4 py-1 rounded-lg">
          Difficulty: {course.difficulty}
        </span>
        <span className="border border-green-500 px-4 py-1 rounded-lg">
          Duration: {course.duration}
        </span>
        <span className="border border-green-500 px-4 py-1 rounded-lg">
          Level: {course.level}
        </span>
        <span className="border border-green-500 px-4 py-1 rounded-lg">
          Tuition: ₦{course.price.toLocaleString()}
        </span>
      </div>

      {/* Instructor */}
      <div className="text-center mb-10 text-sm md:text-base">
        <p>
          <span className="text-green-300 font-semibold">Instructor:</span>{" "}
          {course.instructor}
        </p>
      </div>

      {/* Modules with FREE PREVIEW section */}
      <div className="max-w-5xl mx-auto bg-gray-900 border border-green-500 rounded-xl p-6 mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold">Course Modules</h2>
          <button
            className="text-sm text-green-300 hover:text-green-200"
            onClick={() => setModulesOpen((v) => !v)}
          >
            {modulesOpen ? "▼ Hide modules" : "► Show modules"}
          </button>
        </div>

        {modulesOpen && (
          <>
            <p className="text-xs text-green-400/80 mb-3">
              First {course.freePreviewCount} modules are available as{" "}
              <span className="font-semibold text-green-300">
                free preview
              </span>
              . The rest unlock after payment.
            </p>
            <ul className="mt-2 space-y-2 text-sm">
              {course.modules.map((m, i) => {
                const isFree = i < course.freePreviewCount;
                return (
                  <li
                    key={i}
                    className="flex items-start justify-between border-b border-green-900/40 pb-1"
                  >
                    <span>
                      ✔ {m}{" "}
                      {isFree && (
                        <span className="ml-1 text-[10px] px-2 py-[1px] rounded-full border border-green-400 text-green-300">
                          FREE PREVIEW
                        </span>
                      )}
                    </span>
                    {!isFree && (
                      <span className="text-[10px] text-green-500/80">
                        Unlock after payment
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {/* Requirements & Outcomes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10">
        <div className="bg-gray-900 border border-green-500 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-3">Requirements</h3>
          <ul className="space-y-2 text-sm">
            {course.requirements.map((req, i) => (
              <li key={i}>• {req}</li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-900 border border-green-500 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-3">What You Will Learn</h3>
          <ul className="space-y-2 text-sm">
            {course.outcomes.map((o, i) => (
              <li key={i}>• {o}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Payment Section */}
      <div className="text-center max-w-xl mx-auto mt-4">
        {!user ? (
          <p className="text-sm text-green-300">
            🔐 You must{" "}
            <span className="font-semibold">log in or create an account</span>{" "}
            before enrolling. Use the Login button at the top-right.
          </p>
        ) : (
          <>
            <p className="text-sm text-green-300 mb-3">
              Ready to join this track? Pay securely using Paystack below.
            </p>
            <PaymentButton
              email={user.email}
              amount={course.price}
              metadata={{
                courseId: course.id,
                courseTitle: course.title,
                userId: user.uid,
              }}
              onSuccess={handlePaymentSuccess}
              onClose={handlePaymentClose}
            />
          </>
        )}
      </div>
    </div>
  );
}
