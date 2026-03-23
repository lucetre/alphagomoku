import { type Game, type Color, type GameResponse, type Move } from "./gameStore.js";

interface WebhookPayload {
  gameId: string;
  event: "your_turn";
  color: Color;
  board: (Color | null)[][];
  moves: Move[];
  lastMove?: Move;
}

// Fire webhooks for the player whose turn it is next
export async function notifyWebhooks(game: Game, response: GameResponse, lastMove?: Move) {
  const targetColor = response.nextColor;

  const promises: Promise<void>[] = [];
  for (const webhook of game.webhooks.values()) {
    if (webhook.color !== targetColor) continue;

    const payload: WebhookPayload = {
      gameId: game.gameId,
      event: "your_turn",
      color: targetColor,
      board: response.board,
      moves: response.moves,
      lastMove,
    };

    promises.push(
      fetch(webhook.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(() => {})
        .catch((err) => {
          console.error(`Webhook ${webhook.webhookId} failed:`, err.message);
        })
    );
  }

  await Promise.allSettled(promises);
}
