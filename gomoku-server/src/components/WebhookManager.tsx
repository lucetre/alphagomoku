import { useState, useEffect } from "react";
import type { Color } from "../types";

interface Webhook {
  webhookId: string;
  url: string;
  color: Color;
}

interface WebhookManagerProps {
  gameId: string;
  onLog: (action: string, source: "ui" | "api", detail: string) => void;
}

export function WebhookManager({ gameId, onLog }: WebhookManagerProps) {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [url, setUrl] = useState("");
  const [color, setColor] = useState<Color>("b");

  const fetchWebhooks = async () => {
    const res = await fetch(`/api/games/${gameId}/webhooks`);
    if (res.ok) setWebhooks(await res.json());
  };

  useEffect(() => {
    fetchWebhooks();
  }, [gameId]);

  const addWebhook = async () => {
    if (!url.trim()) return;
    const res = await fetch(`/api/games/${gameId}/webhooks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url.trim(), color }),
    });
    const data = await res.json();
    if (res.ok) {
      setWebhooks((prev) => [...prev, data]);
      setUrl("");
      onLog("WEBHOOK", "ui", `Added webhook for ${color === "b" ? "Black" : "White"}`);
    } else {
      onLog("ERROR", "ui", data.error);
    }
  };

  const removeWebhook = async (webhookId: string) => {
    const res = await fetch(`/api/games/${gameId}/webhooks/${webhookId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setWebhooks((prev) => prev.filter((w) => w.webhookId !== webhookId));
      onLog("WEBHOOK", "ui", `Removed webhook ${webhookId}`);
    }
  };

  return (
    <div className="webhook-manager">
      <h3>Webhooks</h3>
      <div className="webhook-form">
        <input
          type="text"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addWebhook()}
          className="webhook-url-input"
        />
        <select
          value={color}
          onChange={(e) => setColor(e.target.value as Color)}
          className="webhook-color-select"
        >
          <option value="b">Black</option>
          <option value="w">White</option>
        </select>
        <button onClick={addWebhook} className="webhook-add-btn">Add</button>
      </div>
      {webhooks.length > 0 && (
        <div className="webhook-list">
          {webhooks.map((w) => (
            <div key={w.webhookId} className="webhook-item">
              <span className={`turn-dot ${w.color === "b" ? "black" : "white"}`} />
              <span className="webhook-url" title={w.url}>{w.url}</span>
              <button className="webhook-remove-btn" onClick={() => removeWebhook(w.webhookId)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
