import type { VercelRequest, VercelResponse } from "@vercel/node";
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
} from "../lib/gameStore.js";
import { notifyWebhooks } from "../lib/webhook.js";

// Single catch-all handler so all routes share the same in-memory store
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;
  const url = req.url ?? "";

  // Remove query string for matching
  const path = url.split("?")[0];

  // GET /api/games — list all games
  if (method === "GET" && path === "/api/games") {
    return res.status(200).json(listGames());
  }

  // POST /api/games — create game
  if (method === "POST" && path === "/api/games") {
    const { rows, cols } = req.body ?? {};
    const game = createGame(rows, cols);
    return res.status(201).json(game);
  }

  // Match /api/games/:gameId patterns
  const gameMatch = path.match(/^\/api\/games\/([^/]+)$/);
  const moveMatch = path.match(/^\/api\/games\/([^/]+)\/move$/);
  const undoMatch = path.match(/^\/api\/games\/([^/]+)\/undo$/);
  const webhooksMatch = path.match(/^\/api\/games\/([^/]+)\/webhooks$/);
  const webhookDeleteMatch = path.match(/^\/api\/games\/([^/]+)\/webhooks\/([^/]+)$/);

  // GET /api/games/:gameId
  if (method === "GET" && gameMatch) {
    const game = getGame(gameMatch[1]);
    if (!game) return res.status(404).json({ error: "Game not found" });
    return res.status(200).json(game);
  }

  // DELETE /api/games/:gameId
  if (method === "DELETE" && gameMatch) {
    const deleted = deleteGame(gameMatch[1]);
    if (!deleted) return res.status(404).json({ error: "Game not found" });
    return res.status(200).json({ success: true });
  }

  // POST /api/games/:gameId/move
  if (method === "POST" && moveMatch) {
    const gameId = moveMatch[1];
    const { row, col } = req.body ?? {};
    if (typeof row !== "number" || typeof col !== "number") {
      return res.status(400).json({ error: "row and col are required numbers" });
    }
    try {
      const result = placeMove(gameId, row, col);
      const game = getRawGame(gameId);
      if (game) await notifyWebhooks(game, result, result.lastMove);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // POST /api/games/:gameId/undo
  if (method === "POST" && undoMatch) {
    const gameId = undoMatch[1];
    try {
      const result = undoMove(gameId);
      const game = getRawGame(gameId);
      if (game) await notifyWebhooks(game, result);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // GET /api/games/:gameId/webhooks
  if (method === "GET" && webhooksMatch) {
    const webhooks = listWebhooks(webhooksMatch[1]);
    if (!webhooks) return res.status(404).json({ error: "Game not found" });
    return res.status(200).json(webhooks);
  }

  // POST /api/games/:gameId/webhooks
  if (method === "POST" && webhooksMatch) {
    const gameId = webhooksMatch[1];
    const { url, color } = req.body ?? {};
    if (!url || !["b", "w"].includes(color)) {
      return res.status(400).json({ error: "url and color ('b' or 'w') are required" });
    }
    try {
      const webhook = addWebhook(gameId, url, color);
      return res.status(201).json(webhook);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // DELETE /api/games/:gameId/webhooks/:webhookId
  if (method === "DELETE" && webhookDeleteMatch) {
    const removed = removeWebhook(webhookDeleteMatch[1], webhookDeleteMatch[2]);
    if (!removed) return res.status(404).json({ error: "Webhook not found" });
    return res.status(200).json({ success: true });
  }

  return res.status(404).json({ error: "Not found" });
}
