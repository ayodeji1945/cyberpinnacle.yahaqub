// src/pages/dashboard/Dashboard.js
import React, { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { getScore } from "../../services/scoreService";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [score, setScore] = useState(0);
  const [badges, setBadges] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const username =
    user?.displayName || (user?.email ? user.email.split("@")[0] : "Hacker");

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        setLoading(true);

        const scoreValue = await getScore(user.uid);
        setScore(scoreValue || 0);

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setBadges(data.badges || []);
          setEnrolledCourses(data.enrolledCourses || []);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-green-400 pt-32 px-6">
        <p>Loading user…</p>
      </div>
    );
  }

  const challengesCompleted = Math.floor(score / 50);
  const rank =
    score >= 200
      ? "Elite Hacker"
      : score >= 100
      ? "Pro Hacker"
      : score >= 50
      ? "Skilled Hacker"
      : "Rookie Hacker";

  return (
    <div className="min-h-screen bg-black text-green-400 pt-28 px-4 md:px-8 pb-20">
      
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <p className="text-sm text-green-500/80">Dashboard</p>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-1 mb-2">
          Welcome back,{" "}
          <span className="text-green-300">{username}</span>
        </h1>
        <p className="text-sm md:text-base text-green-500/80 max-w-2xl">
          Track your learning, CTF progress, rank, badges, and courses.
        </p>
      </header>

      {/* Stats Cards */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <StatCard label="CTF Score" value={score} hint="Earn points by solving challenges" />
        <StatCard label="Challenges Completed" value={challengesCompleted} hint="Estimated, 50pts each" />
        <StatCard label="Rank" value={rank} hint="Climb ranks by playing" />
      </section>

      {/* Badges */}
      <section className="max-w-6xl mx-auto bg-slate-950 border border-green-500/60 rounded-2xl p-6 md:p-7 shadow-[0_0_35px_rgba(34,197,94,0.28)] mb-10">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold">🏅 Earned Badges</h2>
          <span className="text-xs text-green-400/80">{badges.length} badge(s)</span>
        </div>

        {loading ? (
          <p className="text-green-300">Loading badges…</p>
        ) : badges.length === 0 ? (
          <p className="text-green-300 text-sm">
            No badges yet — complete challenges to earn badges.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="bg-green-500 text-black font-semibold rounded-xl px-3 py-2 text-center shadow-lg"
              >
                {badge}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Courses */}
      <section className="max-w-6xl mx-auto bg-slate-950 border border-green-500/60 rounded-2xl p-6 md:p-7 shadow-[0_0_35px_rgba(34,197,94,0.28)]">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">📚 My Courses</h2>

        {enrolledCourses.length === 0 ? (
          <p className="text-green-300 text-sm">
            You have not enrolled in any course yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {enrolledCourses.map((course, index) => (
              <div
                key={index}
                className="border border-green-500 p-4 rounded-xl bg-black/40"
              >
                <h3 className="text-lg font-bold">{course.title}</h3>
                <p className="text-green-300 text-sm mb-3">{course.desc}</p>

                <Link
                  to={`/courses/${course.id}`}
                  className="inline-block bg-green-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-400"
                >
                  Continue Course
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="bg-slate-950 border border-green-500/60 rounded-2xl p-5 shadow-lg">
      <p className="text-xs uppercase tracking-wide text-green-400/80 mb-1">{label}</p>
      <p className="text-2xl md:text-3xl font-extrabold text-green-300 mb-1">{value}</p>
      <p className="text-[11px] text-green-500/80">{hint}</p>
    </div>
  );
}
