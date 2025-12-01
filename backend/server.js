import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { WebSocketServer } from "ws";

dotenv.config({ path: "./.env" });

console.log("Loaded GROQ Key:", process.env.GROQ_API_KEY);

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "https://cyberpinnacle.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));

// Memory Storage (temporary stats for now)
let adminStats = {
  totalChats: 0,
  totalReconIP: 0,
  totalReconDNS: 0,
  totalReconWHOIS: 0,
  totalReconSubdomains: 0,
  totalForensicsAnalyses: 0,
};

let lastChat = null;
let lastRecon = null;
let lastForensics = null;

// WebSocket Server
const wss = new WebSocketServer({ noServer: true });
const broadcast = (event) => {
  const json = JSON.stringify(event);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(json);
  });
};

// GROQ Client
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Root Endpoint
app.get("/", (req, res) => {
  res.send("CyberPinnacle AI Backend Online");
});

// AI Chat with stats tracking
app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    adminStats.totalChats++;
    lastChat = { prompt, timestamp: new Date().toISOString() };

    const completion = await client.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const aiText = completion.choices[0]?.message?.content || "No response";

    return res.json({ response: aiText });
  } catch (err) {
    console.error("AI Error =>", err);
    return res.status(500).json({ error: "AI Request Failed" });
  }
});

// === ADMIN STATS ENDPOINT (Fix) ===
app.get("/admin/stats", (req, res) => {
  return res.json({
    stats: adminStats,
    lastChat,
    lastRecon,
    lastForensics,
  });
});

// === Dummy Recon Event Example ===
app.post("/recon/event", (req, res) => {
  adminStats.totalReconIP++;
  lastRecon = { type: "IP Lookup", input: req.body.query, timestamp: new Date().toISOString() };
  return res.json({ success: true });
});

// OTP (dummy)
app.post("/send-otp", async (req, res) => {
  console.log(`📩 OTP requested for ${req.body.email}: ${req.body.otp}`);
  return res.json({ success: true });
});

// Start Server
const server = app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
);

server.on("upgrade", (req, socket, head) => {
  if (req.url === "/stream") {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  } else socket.destroy();
});
