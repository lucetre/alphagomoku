export type Color = "b" | "w";

export interface Move {
  row: number;
  col: number;
  color: Color;
}

export interface GameState {
  gameId: string;
  rows: number;
  cols: number;
  board: (Color | null)[][];
  moves: Move[];
  nextColor: Color;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  action: string;
  source: "ui" | "api";
  detail: string;
}
