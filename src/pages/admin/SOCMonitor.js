import React, { useEffect, useState } from "react";

export default function SOCMonitor() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    const wsUrl =
      process.env.NODE_ENV === "production"
        ? "wss://cyberpinnacle-backend.onrender.com/stream"
        : "ws://localhost:5000/stream";

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setStatus("Connected");
      console.log("WebSocket Connected to SOC");
    };

    ws.onerror = (err) => {
      setStatus("Error");
      console.error("WebSocket Error:", err);
    };

    ws.onclose = () => {
      setStatus("Disconnected");
      console.log("WebSocket Closed");
    };

    ws.onmessage = (msg) => {
      console.log("WS RECEIVED:", msg.data);
      const data = JSON.parse(msg.data);
      setEvents((prev) => [...prev, data]);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <h1 className="text-3xl font-bold mb-3">CyberPinnacle SOC – Live Monitor</h1>
      <p className="mb-4 text-green-500">Real-time security events across the platform</p>

      <p className="mb-4">
        <span className="font-bold">Status:</span> {status}
      </p>

      <div className="border border-green-700 rounded-lg p-4 h-[70vh] overflow-y-auto space-y-3 bg-black/50">
        {events.length === 0 && (
          <p className="text-green-600 text-sm">Waiting for events… (Try sending AI message or Recon scan)</p>
        )}

        {events.map((evt, index) => (
          <div key={index} className="p-3 border border-green-700 rounded-lg bg-black/40">
            <p className="text-sm">
              <span className="font-bold">{evt.type.toUpperCase()}</span> — {evt.message}
            </p>
            <p className="text-[11px] opacity-70 mt-1">
              {new Date(evt.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
