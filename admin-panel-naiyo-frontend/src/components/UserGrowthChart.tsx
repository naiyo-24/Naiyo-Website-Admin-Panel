import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 180 },
  { month: "Mar", users: 260 },
  { month: "Apr", users: 310 },
  { month: "May", users: 380 },
  { month: "Jun", users: 450 },
];

const UserGrowthChart = () => {
  return (
    <>
      <style>{`
        .area-card {
          background: #1f2937;
          padding: 20px;
          border-radius: 16px;
          color: white;
        }
        .area-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .area-chart {
          height: 240px;
        }
      `}</style>

      <div className="area-card">
        <div className="area-title">User Growth</div>
        <div className="area-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#22c55e"
                fill="url(#userGrad)"
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default UserGrowthChart;
