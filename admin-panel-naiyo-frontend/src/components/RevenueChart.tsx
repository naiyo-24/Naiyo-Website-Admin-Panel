import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 30000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 28000 },
  { month: "May", revenue: 61000 },
  { month: "Jun", revenue: 45000 },
  { month: "Jul", revenue: 52000 },
];

const RevenueChart = () => {
  return (
    <div
      style={{
        background: "#1f2937",
        padding: "24px",
        borderRadius: "16px",
        height: "100%",
        border: "1px solid #374151",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ margin: 0, color: "white", fontSize: "18px" }}>
          Revenue Overview
        </h3>
        <p style={{ margin: "4px 0 0", color: "#9ca3af", fontSize: "13px" }}>
          Monthly revenue performance
        </p>
      </div>

      <div style={{ height: "300px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value / 1000}k`}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                color: "#ffffff",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "#3b82f6" }}
              formatter={(value) => [
                `₹${Number(value).toLocaleString()}`,
                "Revenue",
              ]}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={4}
              dot={{ r: 4, fill: "#1f2937", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
