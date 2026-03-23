import express from "express";
import cors from "cors";
import {
  createGame,
  getGame,
  getRawGame,
  listGames,
  placeMove,
  undoMove,
  addWebhook,
  listWebhooks,
  removeWebhook,
  deleteGame,
} from "./lib/gameStore";
import { notifyWebhooks } from "./lib/webhook";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/games", (_req, res) => {
  res.json(listGames());
});

app.post("/api/games", (req, res) => {
  const { rows, cols } = req.body ?? {};
  const game = createGame(rows, cols);
  res.status(201).json(game);
});

app.get("/api/games/:gameId", (req, res) => {
  const game = getGame(req.params.gameId);
  if (!game) return res.status(404).json({ error: "Game not found" });
  res.json(game);
});

app.delete("/api/games/:gameId", (req, res) => {
  const deleted = deleteGame(req.params.gameId);
  if (!deleted) return res.status(404).json({ error: "Game not found" });
  res.json({ success: true });
});

app.post("/api/games/:gameId/move", async (req, res) => {
  const { row, col } = req.body ?? {};
  if (typeof row !== "number" || typeof col !== "number") {
    return res.status(400).json({ error: "row and col are required numbers" });
  }
  try {
    const result = placeMove(req.params.gameId, row, col);
    const game = getRawGame(req.params.gameId);
    if (game) await notifyWebhooks(game, result, result.lastMove);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/games/:gameId/undo", async (req, res) => {
  try {
    const result = undoMove(req.params.gameId);
    const game = getRawGame(req.params.gameId);
    if (game) await notifyWebhooks(game, result);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/games/:gameId/webhooks", (req, res) => {
  const webhooks = listWebhooks(req.params.gameId);
  if (!webhooks) return res.status(404).json({ error: "Game not found" });
  res.json(webhooks);
});

app.post("/api/games/:gameId/webhooks", (req, res) => {
  const { url, color } = req.body ?? {};
  if (!url || !["b", "w"].includes(color)) {
    return res.status(400).json({ error: "url and color ('b' or 'w') are required" });
  }
  try {
    const webhook = addWebhook(req.params.gameId, url, color);
    res.status(201).json(webhook);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/games/:gameId/webhooks/:webhookId", (req, res) => {
  const removed = removeWebhook(req.params.gameId, req.params.webhookId);
  if (!removed) return res.status(404).json({ error: "Webhook not found" });
  res.json({ success: true });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
