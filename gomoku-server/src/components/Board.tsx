import type { Color, Move } from "../types";
import "./Board.css";

interface BoardProps {
  rows: number;
  cols: number;
  board: (Color | null)[][];
  moves: Move[];
  onCellClick: (row: number, col: number) => void;
}

export function Board({ rows, cols, board, moves, onCellClick }: BoardProps) {
  const lastMove = moves.length > 0 ? moves[moves.length - 1] : null;

  return (
    <div className="board-container">
      {/* Grid lines layer */}
      <div
        className="board-grid"
        style={{
          gridTemplateColumns: `repeat(${cols - 1}, 1fr)`,
          gridTemplateRows: `repeat(${rows - 1}, 1fr)`,
          width: `${(cols - 1) * 28}px`,
          height: `${(rows - 1) * 28}px`,
        }}
      >
        {Array.from({ length: (rows - 1) * (cols - 1) }).map((_, i) => (
          <div key={i} className="grid-cell" />
        ))}
      </div>

      {/* Stones layer */}
      <div
        className="board-stones"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          width: `${cols * 28}px`,
          height: `${rows * 28}px`,
        }}
      >
        {board.flatMap((row, r) =>
          row.map((cell, c) => {
            const isLast = lastMove && lastMove.row === r && lastMove.col === c;
            return (
              <div
                key={`${r}-${c}`}
                className={[
                  "stone-cell",
                  cell === "b" ? "black" : cell === "w" ? "white" : "",
                  isLast ? "last-move" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => !cell && onCellClick(r, c)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
