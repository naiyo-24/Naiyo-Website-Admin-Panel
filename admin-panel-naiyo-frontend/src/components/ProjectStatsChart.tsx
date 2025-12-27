import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const ProjectStatsChart = ({ data }: { data: any[] }) => {
  return (
    <div style={{ background: "#1f2937", padding: "24px", borderRadius: "16px", border: "1px solid #374151", height: "100%" }}>
      <h3 style={{ margin: "0 0 20px 0", color: "white", fontSize: "18px", fontWeight: "600" }}>Project Status Overview</h3>
      <div style={{ height: "250px", width: "100%" }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
            <XAxis type="number" stroke="#9ca3af" axisLine={false} tickLine={false} fontSize={12} />
            <YAxis dataKey="name" type="category" stroke="white" axisLine={false} tickLine={false} width={100} fontSize={13} />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.05)'}}
              contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", color: "white", borderRadius: "8px" }} 
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.name === 'Completed' ? '#10b981' : '#f59e0b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProjectStatsChart;