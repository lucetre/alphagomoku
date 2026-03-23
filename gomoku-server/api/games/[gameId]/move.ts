import type { VercelRequest, VercelResponse } from "@vercel/node";
import { placeMove, getRawGame } from "../../../lib/gameStore";
import { notifyWebhooks } from "../../../lib/webhook";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { gameId } = req.query;
  const { row, col } = req.body ?? {};

  if (typeof row !== "number" || typeof col !== "number") {
    return res.status(400).json({ error: "row and col are required numbers" });
  }

  try {
    const result = placeMove(gameId as string, row, col);
    const game = getRawGame(gameId as string);
    if (game) {
      await notifyWebhooks(game, result, result.lastMove);
    }
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
