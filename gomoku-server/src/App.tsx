import { useState, useCallback } from "react";
import type { GameState, LogEntry } from "./types";
import { Board } from "./components/Board";
import { Controls } from "./components/Controls";
import { ActivityLog } from "./components/ActivityLog";
import { GameSetup } from "./components/GameSetup";
import "./App.css";

let logCounter = 0;

function App() {
  const [game, setGame] = useState<GameState | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((action: string, source: "ui" | "api", detail: string) => {
    setLogs((prev) => [
      {
        id: ++logCounter,
        timestamp: new Date().toLocaleTimeString(),
        action,
        source,
        detail,
      },
      ...prev,
    ]);
  }, []);

  const createGame = async (rows: number, cols: number) => {
    const res = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows, cols }),
    });
    const data = await res.json();
    setGame(data);
    addLog("CREATE", "ui", `New game ${data.gameId} (${rows}x${cols})`);
  };

  const placeMove = async (row: number, col: number) => {
    if (!game) return;
    const res = await fetch(`/api/games/${game.gameId}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ row, col }),
    });
    const data = await res.json();
    if (res.ok) {
      setGame(data);
      addLog("MOVE", "ui", `${data.lastMove.color === "b" ? "Black" : "White"} at (${row}, ${col})`);
    } else {
      addLog("ERROR", "ui", data.error);
    }
  };

  const undo = async () => {
    if (!game) return;
    const res = await fetch(`/api/games/${game.gameId}/undo`, { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setGame(data);
      addLog("UNDO", "ui", "Last move undone");
    } else {
      addLog("ERROR", "ui", data.error);
    }
  };

  const refresh = async () => {
    if (!game) return;
    const res = await fetch(`/api/games/${game.gameId}`);
    const data = await res.json();
    if (res.ok) {
      setGame(data);
      addLog("REFRESH", "ui", "Board refreshed from server");
    }
  };

  return (
    <div className="app">
      <h1 className="app-title">AlphaGomoku Server</h1>
      {!game ? (
        <GameSetup onCreate={createGame} />
      ) : (
        <div className="game-layout">
          <div className="game-left">
            <Controls
              nextColor={game.nextColor}
              moveCount={game.moves.length}
              gameId={game.gameId}
              onUndo={undo}
              onRefresh={refresh}
              onNewGame={() => setGame(null)}
            />
            <Board
              rows={game.rows}
              cols={game.cols}
              board={game.board}
              moves={game.moves}
              onCellClick={placeMove}
            />
          </div>
          <ActivityLog logs={logs} />
        </div>
      )}
    </div>
  );
}

export default App;
