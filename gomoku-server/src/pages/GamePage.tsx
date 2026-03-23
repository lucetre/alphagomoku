import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { GameState, LogEntry } from "../types";
import { Board } from "../components/Board";
import { Controls } from "../components/Controls";
import { ActivityLog } from "../components/ActivityLog";
import { WebhookManager } from "../components/WebhookManager";

let logCounter = 0;

export function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/games/${gameId}`);
      if (res.ok) {
        const data = await res.json();
        setGame(data);
        addLog("LOAD", "ui", `Loaded game ${gameId}`);
      } else {
        addLog("ERROR", "ui", "Game not found");
      }
      setLoading(false);
    };
    load();
  }, [gameId, addLog]);

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

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!game) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <p>Game <code>{gameId}</code> not found.</p>
        <button onClick={() => navigate("/")} style={{ marginTop: 12 }}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="game-layout">
      <div className="game-left">
        <Controls
          nextColor={game.nextColor}
          moveCount={game.moves.length}
          gameId={game.gameId}
          onUndo={undo}
          onRefresh={refresh}
          onNewGame={() => navigate("/")}
        />
        <Board
          rows={game.rows}
          cols={game.cols}
          board={game.board}
          moves={game.moves}
          onCellClick={placeMove}
        />
      </div>
      <div className="game-right">
        <WebhookManager gameId={game.gameId} onLog={addLog} />
        <ActivityLog logs={logs} />
      </div>
    </div>
  );
}
