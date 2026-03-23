import { useState } from "react";

interface ApiGuideProps {
  gameId: string;
  onMoveSent?: (row: number, col: number) => void;
}

export function ApiGuide({ gameId, onMoveSent }: ApiGuideProps) {
  const base = window.location.origin;
  const [row, setRow] = useState(7);
  const [col, setCol] = useState(7);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);

  const curl = `curl -X POST "${base}/api/games/${gameId}/move" \\
  -H "Content-Type: application/json" \\
  -d '{ "row": ${row}, "col": ${col} }'`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const sendMove = async () => {
    setSending(true);
    try {
      const res = await fetch(`/api/games/${gameId}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row, col }),
      });
      if (res.ok && onMoveSent) {
        onMoveSent(row, col);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="api-guide">
      <h3>API</h3>
      <div className="api-example">
        <div className="api-label">
          <span className="api-method post">POST</span>
          Place a move
        </div>
        <div className="api-inputs">
          <label>
            row
            <input
              type="number"
              min={0}
              value={row}
              onChange={(e) => setRow(Number(e.target.value))}
            />
          </label>
          <label>
            col
            <input
              type="number"
              min={0}
              value={col}
              onChange={(e) => setCol(Number(e.target.value))}
            />
          </label>
        </div>
        <pre className="api-curl">{curl}</pre>
        <div className="api-actions">
          <button className="api-copy-btn" onClick={copyToClipboard}>
            {copied ? "Copied!" : "Copy"}
          </button>
          <button className="api-send-btn" onClick={sendMove} disabled={sending}>
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
