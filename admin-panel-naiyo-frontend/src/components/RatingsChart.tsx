import React from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const RatingsChart = ({ data }: { data: any[] }) => {
  return (
    <div style={{ background: "#1f2937", padding: "24px", borderRadius: "16px", border: "1px solid #374151", height: "100%" }}>
      <h3 style={{ margin: "0 0 10px 0", color: "white", fontSize: "18px", fontWeight: "600" }}>Client Satisfaction</h3>
      <p style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "20px" }}>Distribution of star ratings</p>
      
      <div style={{ height: "220px", width: "100%" }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", color: "white", borderRadius: "8px" }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
               {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`rgba(234, 179, 8, ${0.4 + (index * 0.15)})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RatingsChart;