import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Completed", value: 65, color: "#22c55e" },
  { name: "Pending", value: 25, color: "#eab308" },
  { name: "Cancelled", value: 10, color: "#ef4444" },
];

const OrderStatusChart = () => {
  return (
    <div style={{ background: "#1f2937", padding: "24px", borderRadius: "16px", height: "100%", border: "1px solid #374151", display: "flex", flexDirection: "column" }}>
      <h3 style={{ margin: "0 0 20px 0", color: "white", fontSize: "18px" }}>Order Status</h3>
      
      <div style={{ flex: 1, minHeight: "250px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", color: "white", borderRadius: "8px" }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              formatter={(value) => <span style={{ color: "#9ca3af", marginLeft: "5px" }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderStatusChart;