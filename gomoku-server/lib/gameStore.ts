import { randomUUID } from "crypto";

export type Color = "b" | "w";

export interface Move {
  row: number;
  col: number;
  color: Color;
}

export interface Webhook {
  webhookId: string;
  url: string;
  color: Color;
}

export interface Game {
  gameId: string;
  rows: number;
  cols: number;
  board: (Color | null)[][];
  moves: Move[];
  webhooks: Map<string, Webhook>;
}

export interface GameResponse {
  gameId: string;
  rows: number;
  cols: number;
  board: (Color | null)[][];
  moves: Move[];
  nextColor: Color;
}

// In-memory store — resets on cold start
const games = new Map<string, Game>();

function nextColor(game: Game): Color {
  return game.moves.length % 2 === 0 ? "b" : "w";
}

function toResponse(game: Game): GameResponse {
  return {
    gameId: game.gameId,
    rows: game.rows,
    cols: game.cols,
    board: game.board,
    moves: game.moves,
    nextColor: nextColor(game),
  };
}

export function createGame(rows = 19, cols = 19): GameResponse {
  const gameId = randomUUID().slice(0, 8);
  const board: (Color | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );
  const game: Game = { gameId, rows, cols, board, moves: [], webhooks: new Map() };
  games.set(gameId, game);
  return toResponse(game);
}

export interface GameSummary {
  gameId: string;
  rows: number;
  cols: number;
  moveCount: number;
  nextColor: Color;
}

export function listGames(): GameSummary[] {
  return Array.from(games.values()).map((g) => ({
    gameId: g.gameId,
    rows: g.rows,
    cols: g.cols,
    moveCount: g.moves.length,
    nextColor: nextColor(g),
  }));
}

export function getGame(gameId: string): GameResponse | null {
  const game = games.get(gameId);
  return game ? toResponse(game) : null;
}

export function getRawGame(gameId: string): Game | null {
  return games.get(gameId) ?? null;
}

export function placeMove(gameId: string, row: number, col: number): GameResponse & { lastMove: Move } {
  const game = games.get(gameId);
  if (!game) throw new Error("Game not found");
  if (row < 0 || row >= game.rows || col < 0 || col >= game.cols) {
    throw new Error("Position out of bounds");
  }
  if (game.board[row][col] !== null) {
    throw new Error("Position already occupied");
  }

  const color = nextColor(game);
  game.board[row][col] = color;
  const move: Move = { row, col, color };
  game.moves.push(move);

  return { ...toResponse(game), lastMove: move };
}

export function undoMove(gameId: string): GameResponse {
  const game = games.get(gameId);
  if (!game) throw new Error("Game not found");
  if (game.moves.length === 0) throw new Error("No moves to undo");

  const last = game.moves.pop()!;
  game.board[last.row][last.col] = null;

  return toResponse(game);
}

export function addWebhook(gameId: string, url: string, color: Color): Webhook {
  const game = games.get(gameId);
  if (!game) throw new Error("Game not found");

  const webhook: Webhook = { webhookId: randomUUID().slice(0, 8), url, color };
  game.webhooks.set(webhook.webhookId, webhook);
  return webhook;
}

export function deleteGame(gameId: string): boolean {
  return games.delete(gameId);
}

export function removeWebhook(gameId: string, webhookId: string): boolean {
  const game = games.get(gameId);
  if (!game) return false;
  return game.webhooks.delete(webhookId);
}
