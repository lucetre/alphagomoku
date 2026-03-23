import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createGame } from "../../lib/gameStore";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { rows, cols } = req.body ?? {};
  const game = createGame(rows, cols);
  return res.status(201).json(game);
}
