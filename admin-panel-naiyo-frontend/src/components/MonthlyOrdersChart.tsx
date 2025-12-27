import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", orders: 12 },
  { month: "Feb", orders: 18 },
  { month: "Mar", orders: 25 },
  { month: "Apr", orders: 15 },
  { month: "May", orders: 28 },
  { month: "Jun", orders: 22 },
];

const MonthlyOrdersChart = () => {
  return (
    <>
      <style>{`
        .bar-card {
          background: #1f2937;
          padding: 20px;
          border-radius: 16px;
          color: white;
        }
        .bar-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .bar-chart {
          height: 240px;
        }
      `}</style>

      <div className="bar-card">
        <div className="bar-title">Monthly Orders</div>
        <div className="bar-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar
                dataKey="orders"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
                animationDuration={1200}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default MonthlyOrdersChart;
