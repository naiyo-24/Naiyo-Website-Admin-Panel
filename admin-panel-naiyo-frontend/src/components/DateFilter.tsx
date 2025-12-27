import React, { useState } from "react";

const ranges = ["1D", "1W", "1M"];

const DateFilter = () => {
  const [active, setActive] = useState("1W");

  return (
    <>
      <style>{`
        .date-filter {
          display: flex;
          background: #1f2937;
          border-radius: 999px;
          padding: 4px;
          width: fit-content;
        }

        .date-btn {
          padding: 6px 14px;
          border-radius: 999px;
          border: none;
          background: transparent;
          color: #9ca3af;
          cursor: pointer;
          transition: 0.3s;
        }

        .date-btn.active {
          background: #6366f1;
          color: white;
        }
      `}</style>

      <div className="date-filter">
        {ranges.map(r => (
          <button
            key={r}
            className={`date-btn ${active === r ? "active" : ""}`}
            onClick={() => setActive(r)}
          >
            {r}
          </button>
        ))}
      </div>
    </>
  );
};

export default DateFilter;
