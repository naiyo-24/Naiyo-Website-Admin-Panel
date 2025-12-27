import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const DATA = {
  "1W": [
    { name: "Mon", value: 400 },
    { name: "Tue", value: 300 },
    { name: "Wed", value: 550 },
    { name: "Thu", value: 450 },
    { name: "Fri", value: 600 },
    { name: "Sat", value: 700 },
    { name: "Sun", value: 650 },
  ],
  "1M": [
    { name: "Week 1", value: 2400 },
    { name: "Week 2", value: 3500 },
    { name: "Week 3", value: 2800 },
    { name: "Week 4", value: 4100 },
  ]
};

const DashboardCharts = () => {
  const [range, setRange] = useState<"1W" | "1M">("1W");

  return (
    <div style={{ background: "#1f2937", padding: "24px", borderRadius: "16px", border: "1px solid #374151" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h3 style={{ margin: 0, color: "white", fontSize: "18px" }}>Market Overview</h3>
        <div style={{ display: "flex", background: "#111827", padding: "4px", borderRadius: "8px" }}>
          {["1W", "1M"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r as "1W" | "1M")}
              style={{
                background: range === r ? "#374151" : "transparent",
                color: range === r ? "white" : "#9ca3af",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA[range]}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} dy={10} />
            <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} dx={-10} />
            <Tooltip 
              contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", color: "white", borderRadius: "8px" }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#a855f7" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorVal)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;