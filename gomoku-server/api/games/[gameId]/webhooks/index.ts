import type { VercelRequest, VercelResponse } from "@vercel/node";
import { addWebhook } from "../../../../lib/gameStore";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { gameId } = req.query;
  const { url, color } = req.body ?? {};

  if (!url || !["b", "w"].includes(color)) {
    return res.status(400).json({ error: "url and color ('b' or 'w') are required" });
  }

  try {
    const webhook = addWebhook(gameId as string, url, color);
    return res.status(201).json(webhook);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
