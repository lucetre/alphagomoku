import type { Color } from "../types";

interface ControlsProps {
  nextColor: Color;
  moveCount: number;
  gameId: string;
  onUndo: () => void;
  onRefresh: () => void;
  onNewGame: () => void;
}

export function Controls({ nextColor, moveCount, gameId, onUndo, onRefresh, onNewGame }: ControlsProps) {
  return (
    <div className="controls">
      <div className="controls-info">
        <span className="game-id">Game: {gameId}</span>
        <span className="move-count">Moves: {moveCount}</span>
        <span className="next-turn">
          Next: <span className={`turn-dot ${nextColor === "b" ? "black" : "white"}`} />
          {nextColor === "b" ? "Black" : "White"}
        </span>
      </div>
      <div className="controls-buttons">
        <button onClick={onUndo} disabled={moveCount === 0}>Undo</button>
        <button onClick={onRefresh}>Refresh</button>
        <button onClick={onNewGame}>New Game</button>
      </div>
    </div>
  );
}
