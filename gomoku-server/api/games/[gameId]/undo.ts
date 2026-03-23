import type { VercelRequest, VercelResponse } from "@vercel/node";
import { undoMove, getRawGame } from "../../../lib/gameStore";
import { notifyWebhooks } from "../../../lib/webhook";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { gameId } = req.query;

  try {
    const result = undoMove(gameId as string);
    const game = getRawGame(gameId as string);
    if (game) {
      await notifyWebhooks(game, result);
    }
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
