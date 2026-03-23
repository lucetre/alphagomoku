import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameSetup } from "../components/GameSetup";

interface GameSummary {
  gameId: string;
  rows: number;
  cols: number;
  moveCount: number;
  nextColor: "b" | "w";
}

export function HomePage() {
  const navigate = useNavigate();
  const [games, setGames] = useState<GameSummary[]>([]);

  const fetchGames = async () => {
    const res = await fetch("/api/games");
    if (res.ok) setGames(await res.json());
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const deleteGame = async (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    const res = await fetch(`/api/games/${gameId}`, { method: "DELETE" });
    if (res.ok) setGames((prev) => prev.filter((g) => g.gameId !== gameId));
  };

  const createGame = async (rows: number, cols: number) => {
    const res = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows, cols }),
    });
    const data = await res.json();
    if (res.ok) navigate(`/${data.gameId}`);
  };

  return (
    <div className="home">
      <GameSetup onCreate={createGame} />
      {games.length > 0 && (
        <div className="game-list">
          <h2>Active Games</h2>
          <div className="game-list-items">
            {games.map((g) => (
              <div
                key={g.gameId}
                className="game-list-item"
                onClick={() => navigate(`/${g.gameId}`)}
              >
                <span className="game-list-id">{g.gameId}</span>
                <span className="game-list-size">{g.rows}x{g.cols}</span>
                <span className="game-list-moves">{g.moveCount} moves</span>
                <span className={`turn-dot ${g.nextColor === "b" ? "black" : "white"}`} />
                <button className="game-list-delete" onClick={(e) => deleteGame(e, g.gameId)}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
