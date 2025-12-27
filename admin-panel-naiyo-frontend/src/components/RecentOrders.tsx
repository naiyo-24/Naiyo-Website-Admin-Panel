import React, { useState } from "react";

const ORDERS = [
  { client: "ABC Corp", service: "Web Development", date: "12 Jun 2025", amount: "₹45,000", status: "Completed" },
  { client: "XYZ Pvt Ltd", service: "SEO Optimization", date: "10 Jun 2025", amount: "₹12,500", status: "Pending" },
  { client: "Nova Tech", service: "App Development", date: "08 Jun 2025", amount: "₹85,000", status: "Completed" },
  { client: "Pixel Studio", service: "Branding", date: "06 Jun 2025", amount: "₹25,000", status: "Cancelled" },
  { client: "Alpha Inc", service: "UI/UX Design", date: "04 Jun 2025", amount: "₹30,000", status: "Pending" },
];

const RecentOrders = () => {
  const [search, setSearch] = useState("");

  const filtered = ORDERS.filter((o) =>
    o.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: "#1f2937", padding: "24px", borderRadius: "16px", border: "1px solid #374151", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ margin: 0, fontSize: "18px" }}>Recent Orders</h3>
        <input 
          placeholder="Search client..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ 
            background: "#111827", 
            border: "1px solid #374151", 
            color: "white", 
            padding: "8px 12px", 
            borderRadius: "8px",
            outline: "none",
            fontSize: "14px"
          }}
        />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #374151", color: "#9ca3af" }}>
              <th style={{ textAlign: "left", padding: "12px", fontWeight: "500" }}>Client</th>
              <th style={{ textAlign: "left", padding: "12px", fontWeight: "500" }}>Service</th>
              <th style={{ textAlign: "left", padding: "12px", fontWeight: "500" }}>Date</th>
              <th style={{ textAlign: "left", padding: "12px", fontWeight: "500" }}>Amount</th>
              <th style={{ textAlign: "left", padding: "12px", fontWeight: "500" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #374151" }}>
                <td style={{ padding: "16px 12px", color: "white" }}>{order.client}</td>
                <td style={{ padding: "16px 12px", color: "#d1d5db" }}>{order.service}</td>
                <td style={{ padding: "16px 12px", color: "#9ca3af" }}>{order.date}</td>
                <td style={{ padding: "16px 12px", color: "white", fontWeight: "600" }}>{order.amount}</td>
                <td style={{ padding: "16px 12px" }}>
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "500",
                    background: 
                      order.status === "Completed" ? "rgba(34, 197, 94, 0.2)" :
                      order.status === "Pending" ? "rgba(234, 179, 8, 0.2)" : "rgba(239, 68, 68, 0.2)",
                    color: 
                      order.status === "Completed" ? "#22c55e" :
                      order.status === "Pending" ? "#eab308" : "#ef4444",
                  }}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;