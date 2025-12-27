import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

const ServiceDistributionChart = ({ data }: { data: any[] }) => {
  return (
    <div style={{ background: "#1f2937", padding: "24px", borderRadius: "16px", border: "1px solid #374151", height: "100%" }}>
      <h3 style={{ margin: "0 0 20px 0", color: "white", fontSize: "18px", fontWeight: "600" }}>Demand by Service</h3>
      <div style={{ height: "300px", width: "100%" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", color: "white", borderRadius: "8px" }} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ServiceDistributionChart;