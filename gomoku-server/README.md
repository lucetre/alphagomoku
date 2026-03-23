# AlphaGomoku Server

In-memory Gomoku (Five-in-a-Row) game server with a React UI and REST API.

## Features

- **Flexible board size** — create games with any N×M board
- **REST API** — create games, place moves, undo, and query board state
- **Webhooks** — subscribe to turn notifications per color (black/white)
- **URL-based routing** — each game is accessible at `/:gameId`

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/games` | List all active games |
| `POST` | `/api/games` | Create a new game (`{ rows, cols }`) |
| `GET` | `/api/games/:id` | Get game state |
| `DELETE` | `/api/games/:id` | Delete a game |
| `POST` | `/api/games/:id/move` | Place a stone (`{ row, col }`) |
| `POST` | `/api/games/:id/undo` | Undo last move |
| `GET` | `/api/games/:id/webhooks` | List webhooks |
| `POST` | `/api/games/:id/webhooks` | Register webhook (`{ url, color }`) |
| `DELETE` | `/api/games/:id/webhooks/:wid` | Remove webhook |

Webhooks receive a POST with `{ gameId, event: "your_turn", color, board, moves, lastMove }` when it becomes the subscribed color's turn.

## Development

```bash
npm install
npm run dev       # starts Vite (frontend) + Express (API) concurrently
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001/api/...` (proxied through Vite)

## Deploy

Deployed on Vercel. The API runs as a single serverless function (`api/index.ts`) with in-memory state (resets on cold start).

```bash
vercel --prod
```
