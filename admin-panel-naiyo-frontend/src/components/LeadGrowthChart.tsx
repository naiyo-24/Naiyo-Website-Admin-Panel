import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const LeadGrowthChart = ({ data }: { data: any[] }) => {
  return (
    <div style={{ background: "#1f2937", padding: "24px", borderRadius: "16px", border: "1px solid #374151", height: "100%" }}>
      <h3 style={{ margin: "0 0 20px 0", color: "white", fontSize: "18px", fontWeight: "600" }}>Leads & Queries Growth</h3>
      <div style={{ height: "300px", width: "100%" }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} dy={10} fontSize={12} />
            <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} dx={-10} fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", color: "white", borderRadius: "8px" }}
              itemStyle={{ color: "#3b82f6" }}
            />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LeadGrowthChart;