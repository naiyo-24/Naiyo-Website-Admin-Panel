import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import apiBaseUrl from "../apiBaseUrl";
import { 
  Search, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  FileText, 
  User, 
  Calendar,
  Loader2,
  X
} from "lucide-react";

// --- TYPES ---
type CustomerQuery = {
  id: number;
  customer_name: string;
  cust_email: string;
  cust_phone: string;
  query_subject: string;
  message: string;
  selected_plan: string;
  service_type: string;
  service_price: string;
  created_at?: string;
};

export default function Clients() {
  const [queries, setQueries] = useState<CustomerQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [selectedQuery, setSelectedQuery] = useState<CustomerQuery | null>(null);

  /* ================= FETCH DATA ================= */
  const fetchQueries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/customer_query`);
      if (res.ok) {
        const data = await res.json();
        setQueries(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch queries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;
    try {
      const res = await fetch(`${apiBaseUrl}/customer_query/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setQueries((prev) => prev.filter((q) => q.id !== id));
        if (selectedQuery?.id === id) setSelectedQuery(null);
      } else {
        const errData = await res.json();
        alert(`Failed to delete: ${errData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("Network error. Check backend connection.");
    }
  };

  /* ================= COMPUTED ================= */
  const filteredQueries = useMemo(() => {
    const lowerQ = searchQuery.toLowerCase();
    return queries.filter((q) => 
      (q.customer_name && q.customer_name.toLowerCase().includes(lowerQ)) ||
      (q.cust_email && q.cust_email.toLowerCase().includes(lowerQ)) ||
      (q.service_type && q.service_type.toLowerCase().includes(lowerQ))
    );
  }, [queries, searchQuery]);

  return (
    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}>
      <div className="clients-page">
        <style>{`
          .clients-page { font-family: 'Poppins', sans-serif; color: white; min-height: 100vh; }
          
          /* HEADER */
          .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
          .header-title h1 { font-size: 28px; font-weight: 700; margin: 0; color: white; }
          
          .toolbar { display: flex; gap: 12px; background: #1f2937; padding: 6px; border-radius: 12px; border: 1px solid #374151; align-items: center; }
          .search-box { display: flex; align-items: center; padding: 0 12px; gap: 8px; background: #111827; border-radius: 8px; height: 40px; }
          .search-box input { background: transparent; border: none; outline: none; color: white; font-size: 14px; width: 240px; }
          
          /* TABLE STYLES */
          .table-container { background: #1f2937; border-radius: 16px; border: 1px solid #374151; overflow: hidden; }
          table { width: 100%; border-collapse: collapse; text-align: left; }
          th { background: #111827; color: #9ca3af; font-weight: 500; font-size: 13px; padding: 16px; border-bottom: 1px solid #374151; }
          td { padding: 16px; border-bottom: 1px solid #374151; color: #e5e7eb; font-size: 14px; vertical-align: middle; }
          tr:last-child td { border-bottom: none; }
          tr:hover td { background: rgba(255,255,255,0.02); }

          .client-cell { display: flex; align-items: center; gap: 12px; }
          .avatar-circle { width: 36px; height: 36px; border-radius: 50%; background: #374151; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #e5e7eb; font-size: 14px; text-transform: uppercase; }
          .client-info div { line-height: 1.4; }
          .client-email { font-size: 12px; color: #9ca3af; }

          .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; display: inline-block; }
          .badge-service { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
          .badge-plan { background: rgba(16, 185, 129, 0.15); color: #34d399; }
          
          .action-btn { background: transparent; border: 1px solid #374151; color: #9ca3af; padding: 6px; border-radius: 6px; cursor: pointer; transition: 0.2s; margin-left: 6px; }
          .action-btn:hover { background: #374151; color: white; }
          .action-btn.delete:hover { border-color: #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.1); }

          /* MODAL */
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
          .modal-content { background: #1f2937; border: 1px solid #374151; width: 100%; max-width: 600px; border-radius: 16px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); animation: slideUp 0.3s ease; }
          .modal-header { padding: 20px 24px; border-bottom: 1px solid #374151; display: flex; justify-content: space-between; align-items: center; }
          .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
          
          .detail-row { display: flex; gap: 12px; }
          .detail-icon { color: #3b82f6; margin-top: 2px; }
          .detail-content h4 { margin: 0 0 4px 0; color: #9ca3af; font-size: 12px; font-weight: 500; }
          .detail-content p { margin: 0; color: white; font-size: 15px; }
          
          .msg-box { background: #111827; padding: 16px; border-radius: 12px; border: 1px solid #374151; }
          .empty-state { text-align: center; padding: 60px; color: #6b7280; }

          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>

        <div className="page-header">
          <div className="header-title">
            <h1>Customer Queries</h1>
          </div>
          <div className="toolbar">
            <div className="search-box">
              <Search size={16} color="#9ca3af" />
              <input 
                placeholder="Search clients, emails..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
           <div style={{ display: "flex", justifyContent: "center", paddingTop: "100px" }}>
             <Loader2 className="animate-spin" size={40} color="#3b82f6" />
           </div>
        ) : filteredQueries.length === 0 ? (
          <div className="empty-state">
            <User size={48} style={{ opacity: 0.3, marginBottom: "16px", margin: "0 auto" }} />
            <h3>No queries found</h3>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service Interest</th>
                  <th>Plan & Budget</th>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueries.map((q) => (
                  <tr key={q.id}>
                    <td>
                      <div className="client-cell">
                        <div className="avatar-circle">
                          {q.customer_name ? q.customer_name.charAt(0) : "U"}
                        </div>
                        <div className="client-info">
                          <div>{q.customer_name}</div>
                          <div className="client-email">{q.cust_email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-service">
                        {q.service_type || "General Inquiry"}
                      </span>
                      <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
                        {q.query_subject}
                      </div>
                    </td>
                    <td>
                      {q.selected_plan ? (
                        <span className="badge badge-plan">{q.selected_plan}</span>
                      ) : (
                        <span style={{ color: "#6b7280", fontSize: "12px" }}>N/A</span>
                      )}
                      <div style={{ fontWeight: 600, marginTop: "4px", fontSize: "13px" }}>
                        {q.service_price ? `₹${q.service_price}` : "-"}
                      </div>
                    </td>
                    <td style={{ color: "#9ca3af", fontSize: "13px" }}>
                      {q.created_at ? new Date(q.created_at).toLocaleDateString() : "Unknown"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="action-btn" onClick={() => setSelectedQuery(q)} title="View Details">
                        <Eye size={16} />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(q.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- VIEW MODAL --- */}
        {selectedQuery && (
          <div className="modal-overlay" onClick={() => setSelectedQuery(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 style={{ margin: 0, color: "white" }}>Query Details</h3>
                <button style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }} onClick={() => setSelectedQuery(null)}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-body">
                {/* Client Info Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="detail-row">
                    <User size={18} className="detail-icon" />
                    <div className="detail-content">
                      <h4>Customer Name</h4>
                      <p>{selectedQuery.customer_name}</p>
                    </div>
                  </div>
                  <div className="detail-row">
                    <Mail size={18} className="detail-icon" />
                    <div className="detail-content">
                      <h4>Email Address</h4>
                      <p>{selectedQuery.cust_email}</p>
                    </div>
                  </div>
                  <div className="detail-row">
                    <Phone size={18} className="detail-icon" />
                    <div className="detail-content">
                      <h4>Phone Number</h4>
                      <p>{selectedQuery.cust_phone}</p>
                    </div>
                  </div>
                  <div className="detail-row">
                    <Calendar size={18} className="detail-icon" />
                    <div className="detail-content">
                      <h4>Submitted On</h4>
                      <p>{selectedQuery.created_at ? new Date(selectedQuery.created_at).toLocaleString() : "-"}</p>
                    </div>
                  </div>
                </div>

                <hr style={{ borderColor: "#374151", margin: 0 }} />

                {/* Service Details */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  <div>
                     <h4 style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "4px" }}>Service Type</h4>
                     <span className="badge badge-service">{selectedQuery.service_type || "N/A"}</span>
                  </div>
                  <div>
                     <h4 style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "4px" }}>Selected Plan</h4>
                     <span className="badge badge-plan">{selectedQuery.selected_plan || "N/A"}</span>
                  </div>
                  <div>
                     <h4 style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "4px" }}>Estimated Budget</h4>
                     <span style={{ fontWeight: "bold", color: "white" }}>{selectedQuery.service_price ? `₹${selectedQuery.service_price}` : "-"}</span>
                  </div>
                </div>

                {/* Full Message */}
                <div>
                  <div className="detail-row" style={{ marginBottom: "8px" }}>
                    <FileText size={18} className="detail-icon" />
                    <div className="detail-content">
                      <h4>Message / Requirement</h4>
                    </div>
                  </div>
                  <div className="msg-box">
                    <strong style={{ display: "block", marginBottom: "6px", color: "white", fontSize: "14px" }}>
                      Subject: {selectedQuery.query_subject}
                    </strong>
                    <p style={{ margin: 0, color: "#d1d5db", fontSize: "14px", lineHeight: "1.6" }}>
                      {selectedQuery.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </Sidebar>
  );
}