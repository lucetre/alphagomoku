import { useState } from "react";

interface GameSetupProps {
  onCreate: (rows: number, cols: number) => void;
}

export function GameSetup({ onCreate }: GameSetupProps) {
  const [rows, setRows] = useState(15);
  const [cols, setCols] = useState(15);

  return (
    <div className="game-setup">
      <h2>New Game</h2>
      <div className="setup-fields">
        <label>
          Rows
          <input
            type="number"
            min={5}
            max={30}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
          />
        </label>
        <label>
          Cols
          <input
            type="number"
            min={5}
            max={30}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
          />
        </label>
      </div>
      <button className="create-btn" onClick={() => onCreate(rows, cols)}>
        Create Game
      </button>
    </div>
  );
}
