import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.get("/api/admin/logs", async (req, res) => {
    try {
      // Endpoint no servidor externo de logs via Cloudflare Tunnel
      const response = await fetch("https://till-platform-pixels-mold.trycloudflare.com/api/logs", {
        headers: {
          "Authorization": "Bearer evn_secret_key_8b3f2a1d",
          "x-api-key": "evn_secret_key_8b3f2a1d"
        }
      });
      
      if (!response.ok) {
        return res.status(response.status).json({ error: "Falha ao conectar no servidor de logs", details: await response.text() });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Dev server running on http://localhost:${PORT}`);
  });
}

startServer();
