import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://cyberpinnacle-backend.onrender.com"
    : "http://localhost:5000";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE}/admin/stats`);
        setData(res.data);
      } catch (err) {
        console.error("Admin stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 pt-24 px-4">
        <p>Loading admin stats…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-green-400 pt-24 px-4">
        <p>Failed to load admin statistics.</p>
      </div>
    );
  }

  const { stats, lastChat, lastRecon, lastForensics } = data;

  const totalRecon =
    (stats?.totalReconIP || 0) +
    (stats?.totalReconDNS || 0) +
    (stats?.totalReconWHOIS || 0) +
    (stats?.totalReconSubdomains || 0);

  return (
    <div className="min-h-screen bg-black text-green-400 pt-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">
          CyberPinnacle Admin Dashboard
        </h1>
        <p className="text-sm text-green-500 mb-6">
          Overview of AI usage, recon activity, and forensic analyses.
        </p>

        {/* Top stats cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <StatCard
            title="Total AI Chats"
            value={stats?.totalChats || 0}
            subtitle="Conversations handled by CyberPinnacle AI"
          />
          <StatCard
            title="Total Recon Requests"
            value={totalRecon}
            subtitle="IP, DNS, WHOIS and Subdomain lookups"
          />
          <StatCard
            title="Forensics Analyses"
            value={stats?.totalForensicsAnalyses || 0}
            subtitle="Evidence files processed in Forensics Lab"
          />
        </div>

        {/* Breakdown + recent activity */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <BreakdownCard stats={stats} />
          <RecentActivityCard
            lastChat={lastChat}
            lastRecon={lastRecon}
            lastForensics={lastForensics}
          />
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3 text-sm mt-4">
          <a
            href="/ai"
            className="px-3 py-2 border border-green-600 rounded-lg hover:bg-green-900/40"
          >
            Go to AI Assistant
          </a>
          <a
            href="/ai/recon"
            className="px-3 py-2 border border-green-600 rounded-lg hover:bg-green-900/40"
          >
            Open Recon Tools
          </a>
          <a
            href="/ai/forensics"
            className="px-3 py-2 border border-green-600 rounded-lg hover:bg-green-900/40"
          >
            Open Forensics Lab
          </a>
          <a
            href="/ai/reports"
            className="px-3 py-2 border border-green-600 rounded-lg hover:bg-green-900/40"
          >
            View Reports
          </a>
          <a
            href="/admin/logs"
            className="px-3 py-2 border border-green-600 rounded-lg hover:bg-green-900/40"
          >
            View Admin Logs
          </a>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle }) {
  return (
    <div className="border border-green-700 rounded-xl p-4 bg-black/60">
      <h2 className="text-sm font-semibold text-green-300 mb-1">{title}</h2>
      <p className="text-3xl font-bold text-green-400 mb-1">{value}</p>
      <p className="text-[11px] text-green-500">{subtitle}</p>
    </div>
  );
}

function BreakdownCard({ stats }) {
  return (
    <div className="border border-green-700 rounded-xl p-4 bg-black/60 text-sm">
      <h2 className="text-sm font-semibold text-green-300 mb-3">
        Recon & Forensics Breakdown
      </h2>
      <ul className="space-y-1 text-green-400">
        <li>IP Info lookups: {stats?.totalReconIP || 0}</li>
        <li>DNS lookups: {stats?.totalReconDNS || 0}</li>
        <li>WHOIS lookups: {stats?.totalReconWHOIS || 0}</li>
        <li>Subdomain AI runs: {stats?.totalReconSubdomains || 0}</li>
        <li>Forensics analyses: {stats?.totalForensicsAnalyses || 0}</li>
      </ul>
      <p className="text-[11px] text-green-500 mt-3">
        These numbers reset when the backend server restarts (in-memory
        counters for now).
      </p>
    </div>
  );
}

function RecentActivityCard({ lastChat, lastRecon, lastForensics }) {
  return (
    <div className="border border-green-700 rounded-xl p-4 bg-black/60 text-sm">
      <h2 className="text-sm font-semibold text-green-300 mb-3">
        Recent Activity
      </h2>

      {/* Last AI chat */}
      <div className="mb-3">
        <h3 className="text-xs font-semibold text-green-400 mb-1">
          Last AI Chat
        </h3>
        {lastChat ? (
          <div className="text-[11px] text-green-300 space-y-1">
            <p>
              <span className="font-semibold">Time:</span>{" "}
              {new Date(lastChat.timestamp).toLocaleString()}
            </p>
            <p className="line-clamp-2">
              <span className="font-semibold">Prompt:</span>{" "}
              {lastChat.prompt}
            </p>
          </div>
        ) : (
          <p className="text-[11px] text-green-500">No chats yet.</p>
        )}
      </div>

      {/* Last Recon */}
      <div className="mb-3">
        <h3 className="text-xs font-semibold text-green-400 mb-1">
          Last Recon Request
        </h3>
        {lastRecon ? (
          <div className="text-[11px] text-green-300 space-y-1">
            <p>
              <span className="font-semibold">Time:</span>{" "}
              {new Date(lastRecon.timestamp).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Type:</span>{" "}
              {lastRecon.type}
            </p>
            <p className="line-clamp-1">
              <span className="font-semibold">Input:</span>{" "}
              {lastRecon.input}
            </p>
          </div>
        ) : (
          <p className="text-[11px] text-green-500">No recon yet.</p>
        )}
      </div>

      {/* Last Forensics */}
      <div>
        <h3 className="text-xs font-semibold text-green-400 mb-1">
          Last Forensics Analysis
        </h3>
        {lastForensics ? (
          <div className="text-[11px] text-green-300 space-y-1">
            <p>
              <span className="font-semibold">Time:</span>{" "}
              {new Date(lastForensics.timestamp).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">File:</span>{" "}
              {lastForensics.filename}
            </p>
            <p>
              <span className="font-semibold">Threat Level:</span>{" "}
              {lastForensics.threatLevel}
            </p>
          </div>
        ) : (
          <p className="text-[11px] text-green-500">
            No forensic analysis yet.
          </p>
        )}
      </div>
    </div>
  );
}
