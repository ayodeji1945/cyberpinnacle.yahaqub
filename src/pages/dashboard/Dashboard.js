import React, { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { getScore } from "../../services/scoreService";

export default function Dashboard() {
  const { user } = useAuth();
  const [score, setScore] = useState(0);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      // Fetch Score properly
      const scoreValue = await getScore(user.uid);
      setScore(scoreValue);

      // Fetch user data
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setBadges(snap.data().badges || []);
      }
    }

    loadData();
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-green-400 pt-28 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-green-300 text-lg mb-8">
          Logged in as: <span className="font-semibold">{user?.email}</span>
        </p>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="CTF Score" value={score} />
          <Card title="Challenges Completed" value={Math.floor(score / 50)} />
          <Card
            title="Rank"
            value={
              score >= 200 ? "Elite Hacker" :
              score >= 100 ? "Pro Hacker" :
              score >= 50 ? "Skilled Hacker" :
                             "Rookie Hacker"
            }
          />
        </div>

        {/* BADGES */}
        <div className="mt-10 bg-gray-900 border border-green-500 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4">🏅 Earned Badges</h2>

          {badges.length === 0 ? (
            <p className="text-green-300">No badges yet — start hacking!</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {badges.map((badge, i) => (
                <div
                  key={i}
                  className="bg-green-500 text-black font-bold rounded-lg p-3 text-center shadow-md hover:scale-105 transition"
                >
                  {badge}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-gray-900 border border-green-400 rounded-xl p-6 shadow-md hover:shadow-green-400/40 transition">
      <h2 className="text-lg font-semibold text-green-300 mb-2">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
