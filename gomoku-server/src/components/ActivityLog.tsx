import type { LogEntry } from "../types";

interface ActivityLogProps {
  logs: LogEntry[];
}

export function ActivityLog({ logs }: ActivityLogProps) {
  return (
    <div className="activity-log">
      <h2>Activity Log</h2>
      <div className="log-list">
        {logs.length === 0 ? (
          <p className="log-empty">No activity yet</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={`log-entry log-${log.action.toLowerCase()}`}>
              <span className="log-time">{log.timestamp}</span>
              <span className={`log-source ${log.source}`}>{log.source.toUpperCase()}</span>
              <span className="log-action">{log.action}</span>
              <span className="log-detail">{log.detail}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
