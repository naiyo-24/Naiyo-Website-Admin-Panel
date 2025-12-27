import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

const MOCK_DATA = {
  Services: ["Web Development", "SEO Optimization", "UI/UX Design"],
  Clients: ["ABC Corp", "XYZ Pvt Ltd", "Nova Tech"],
  Orders: ["Order #1021", "Order #1022", "Order #1023"],
};

const GlobalSearch = ({ open, onClose }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!open) return null;

  return (
    <>
      <style>{`
        .search-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 2000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 120px;
        }

        .search-modal {
          width: 520px;
          background: #111827;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          color: white;
          font-family: 'Poppins', sans-serif;
        }

        .search-header {
          display: flex;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #374151;
          gap: 10px;
        }

        .search-input {
          background: transparent;
          border: none;
          outline: none;
          color: white;
          width: 100%;
          font-size: 15px;
        }

        .results {
          max-height: 300px;
          overflow-y: auto;
          padding: 10px;
        }

        .group-title {
          font-size: 12px;
          color: #9ca3af;
          margin: 10px 0 6px;
        }

        .result-item {
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
        }

        .result-item:hover {
          background: #1f2937;
        }

        .empty {
          padding: 30px;
          text-align: center;
          color: #9ca3af;
        }
      `}</style>

      <div className="search-overlay" onClick={onClose}>
        <div className="search-modal" onClick={(e) => e.stopPropagation()}>
          <div className="search-header">
            <Search size={18} />
            <input
              className="search-input"
              autoFocus
              placeholder="Search services, clients, orders..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <X size={18} onClick={onClose} style={{ cursor: "pointer" }} />
          </div>

          <div className="results">
            {Object.entries(MOCK_DATA).map(([group, items]) => {
              const filtered = items.filter((i) =>
                i.toLowerCase().includes(query.toLowerCase())
              );

              if (!filtered.length) return null;

              return (
                <div key={group}>
                  <div className="group-title">{group}</div>
                  {filtered.map((item, idx) => (
                    <div key={idx} className="result-item">
                      {item}
                    </div>
                  ))}
                </div>
              );
            })}

            {!query && (
              <div className="empty">Start typing to search…</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobalSearch;
