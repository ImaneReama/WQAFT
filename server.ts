import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { spawn } from "child_process";

let myFilename = "";
let myDirname = "";

try {
  // ESM
  myFilename = fileURLToPath(import.meta.url);
  myDirname = path.dirname(myFilename);
} catch (e) {
  // CJS fallback
  myFilename = typeof __filename !== "undefined" ? __filename : "";
  myDirname = typeof __dirname !== "undefined" ? __dirname : process.cwd();
}

const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "database.json");

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(express.json());

  const runPython = (command: string, args: any[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn("python3", ["main.py", command, ...args.map(a => typeof a === 'object' ? JSON.stringify(a) : a)]);
      let stdout = "";
      let stderr = "";
      pythonProcess.stdout.on("data", (data) => stdout += data.toString());
      pythonProcess.stderr.on("data", (data) => stderr += data.toString());
      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          console.error(`Python Error (${command}): ${stderr}`);
          reject(new Error(stderr || `Exit code ${code}`));
        } else {
          try {
            resolve(JSON.parse(stdout));
          } catch (e) {
            reject(new Error("Invalid JSON from Python"));
          }
        }
      });
    });
  };

  // --- API Routes ---

  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = await runPython("register", [req.body]);
      if (result.error) return res.status(400).json({ error: result.error });
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const user = await runPython("login", [req.body.email, req.body.password]);
      if (!user || user.error) {
        return res.status(401).json({ error: user?.error || "Invalid credentials" });
      }
      res.json(user);
    } catch (e) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/mechanics", async (req, res) => {
    try {
      const mechanics = await runPython("get_mechanics");
      res.json(mechanics);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch mechanics" });
    }
  });

  app.post("/api/diagnostic", async (req, res) => {
    try {
      const result = await runPython("diagnostic", [req.body.description]);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "Diagnostic failed" });
    }
  });

  app.post("/api/requests", async (req, res) => {
    try {
      const newRequest = await runPython("create_request", [req.body]);
      broadcast({ type: "NEW_REQUEST", data: newRequest });
      res.json(newRequest);
    } catch (e) {
      res.status(500).json({ error: "Request creation failed" });
    }
  });

  app.post("/api/requests/:id/bid", async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      const result = await runPython("add_bid", [id, req.body]);
      if (result.error) return res.status(404).json({ error: result.error });
      
      const bid = result.bids[result.bids.length - 1];
      broadcast({ type: "NEW_BID", data: { requestId: id, bid, userId } });
      res.json(bid);
    } catch (e) {
      res.status(500).json({ error: "Bidding failed" });
    }
  });

  app.patch("/api/requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await runPython("update_request", [id, req.body]);
      if (result.error) return res.status(404).json({ error: result.error });
      
      broadcast({ type: "REQUEST_UPDATED", data: result });
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "Update failed" });
    }
  });

  // --- WebSocket Logic ---

  const clients = new Map<string, WebSocket>();

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const userId = url.searchParams.get("userId");
    
    if (userId) {
      clients.set(userId, ws);
    }

    ws.on("message", async (message) => {
      try {
        const payload = JSON.parse(message.toString());
        if (payload.type === "CHAT_MESSAGE") {
          const { from, to, text, requestId } = payload.data;
          
          // Save via Python
          const msg = await runPython("save_message", [{ from, to, text, requestId }]);
          
          const target = clients.get(to);
          if (target && target.readyState === WebSocket.OPEN) {
            target.send(JSON.stringify({ type: "CHAT_MESSAGE", data: msg }));
          }
        }
      } catch (e) {
        console.error("WS Message Error", e);
      }
    });

    ws.on("close", () => {
      if (userId) clients.delete(userId);
    });
  });

  function broadcast(payload: any) {
    const message = JSON.stringify(payload);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // --- Vite / Static ---

  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in development mode with Vite...");
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.error("Failed to load Vite:", e);
    }
  } else {
    console.log("Starting in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Wqaft Server running on http://localhost:${PORT}`);
  });
}

startServer();
