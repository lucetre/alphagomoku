import type { VercelRequest, VercelResponse } from "@vercel/node";
import { removeWebhook } from "../../../../lib/gameStore";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { gameId, webhookId } = req.query;
  const removed = removeWebhook(gameId as string, webhookId as string);

  if (!removed) {
    return res.status(404).json({ error: "Webhook not found" });
  }

  return res.status(200).json({ success: true });
}
