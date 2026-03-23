import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getGame } from "../../../lib/gameStore";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { gameId } = req.query;
  const game = getGame(gameId as string);
  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  return res.status(200).json(game);
}
