import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import apiBaseUrl from "../apiBaseUrl";
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Filter, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

// --- TYPES ---
type Service = {
  service_id?: number;
  main_service: string;
  sub_service: string;
  short_desc: string;
  long_desc: string;
  service_charge: number;
  service_logo?: string | null;
};

const emptyService: Service = {
  main_service: "",
  sub_service: "",
  short_desc: "",
  long_desc: "",
  service_charge: 0,
};

const MAIN_SERVICES = [
  "Web Development Services",
  "Mobile Application Services",
  "Servers & Hosting Services",
  "Professional Email Services",
  "Domain Registration Services",
  "Marketing Services",
  "Business Solution Services",
  "Logo & Branding Services",
  "SEO Services",
  "Market Research Services",
  "Finance Services",
  "MISC",
];

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Service>(emptyService);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= FETCH DATA ================= */
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/admin/services`);
      if (res.ok) {
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  /* ================= COMPUTED DATA ================= */
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch = 
        s.sub_service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.main_service.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filterCategory === "All" || s.main_service === filterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, filterCategory]);

  /* ================= ACTIONS ================= */
  const handleEdit = (service: Service) => {
    setFormData(service);
    setEditingId(service.service_id!);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setFormData(emptyService);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEdit = editingId !== null;
    const url = isEdit
      ? `${apiBaseUrl}/admin/services/${editingId}`
      : `${apiBaseUrl}/admin/services`;

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchServices();
        setIsModalOpen(false);
      } else {
        alert("Failed to save service");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await fetch(`${apiBaseUrl}/admin/services/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.service_id !== id));
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  return (
    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}>
      <div className="services-page">
        {/* STYLES */}
        <style>{`
          .services-page {
            font-family: 'Poppins', sans-serif;
            color: white;
            min-height: 100vh;
          }

          /* --- HEADER TOOLBAR --- */
          .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 16px;
          }

          .header-title h1 {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            background: linear-gradient(90deg, #fff, #9ca3af);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .toolbar {
            display: flex;
            gap: 12px;
            background: #1f2937;
            padding: 6px;
            border-radius: 12px;
            border: 1px solid #374151;
            align-items: center;
          }

          .search-box {
            display: flex;
            align-items: center;
            padding: 0 12px;
            gap: 8px;
            background: #111827;
            border-radius: 8px;
            height: 40px;
            border: 1px solid transparent;
            transition: 0.2s;
          }

          .search-box:focus-within {
            border-color: #3b82f6;
          }

          .search-box input {
            background: transparent;
            border: none;
            outline: none;
            color: white;
            font-size: 14px;
            width: 200px;
          }

          .category-select {
            background: #111827;
            color: #d1d5db;
            border: none;
            padding: 0 16px;
            height: 40px;
            border-radius: 8px;
            outline: none;
            cursor: pointer;
            font-size: 14px;
          }

          .add-btn {
            background: #2563eb;
            color: white;
            border: none;
            padding: 0 20px;
            height: 44px;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: 0.2s;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          }

          .add-btn:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
          }

          /* --- GRID LAYOUT --- */
          .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
            gap: 24px;
          }

          .service-card {
            background: #1f2937;
            border: 1px solid #374151;
            border-radius: 16px;
            padding: 24px;
            transition: all 0.25s ease;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }

          .service-card:hover {
            transform: translateY(-5px);
            border-color: #4b5563;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
          }

          .card-badge {
            display: inline-block;
            background: rgba(59, 130, 246, 0.15);
            color: #60a5fa;
            font-size: 11px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 20px;
            margin-bottom: 12px;
            width: fit-content;
          }

          .card-title {
            font-size: 18px;
            font-weight: 700;
            color: white;
            margin: 0 0 8px 0;
          }

          .card-desc {
            font-size: 13px;
            color: #9ca3af;
            line-height: 1.5;
            flex-grow: 1;
            margin-bottom: 16px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #374151;
            padding-top: 16px;
            margin-top: auto;
          }

          .price-tag {
            font-size: 18px;
            font-weight: 700;
            color: #34d399;
          }

          .action-group {
            display: flex;
            gap: 8px;
          }

          .icon-btn {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: 0.2s;
          }

          .edit-btn { background: #374151; color: #e5e7eb; }
          .edit-btn:hover { background: #4b5563; color: white; }

          .delete-btn { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
          .delete-btn:hover { background: #ef4444; color: white; }

          /* --- EMPTY STATE --- */
          .empty-state {
            text-align: center;
            padding: 60px;
            color: #6b7280;
          }

          /* --- MODAL --- */
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .modal-content {
            background: #1f2937;
            border: 1px solid #374151;
            width: 100%;
            max-width: 500px;
            border-radius: 16px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.3s ease;
          }

          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .modal-header {
            padding: 20px 24px;
            border-bottom: 1px solid #374151;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .modal-header h3 { margin: 0; color: white; font-size: 18px; }

          .close-btn {
            background: none; border: none; color: #9ca3af; cursor: pointer;
          }
          .close-btn:hover { color: white; }

          .modal-body {
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .form-group label {
            display: block;
            font-size: 13px;
            color: #d1d5db;
            margin-bottom: 6px;
          }

          .form-input, .form-select, .form-textarea {
            width: 100%;
            background: #111827;
            border: 1px solid #374151;
            color: white;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
            transition: 0.2s;
            box-sizing: border-box; /* Fix padding issues */
          }

          .form-input:focus, .form-textarea:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
          }

          .modal-footer {
            padding: 16px 24px;
            border-top: 1px solid #374151;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }

          .cancel-btn {
            background: transparent;
            color: #d1d5db;
            border: 1px solid #374151;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
          }

          .save-btn {
            background: #2563eb;
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .save-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        `}</style>

        {/* --- TOP HEADER --- */ }
        <div className="page-header">
          <div className="header-title">
            <h1>Services Manager</h1>
          </div>
          
          <div className="toolbar">
            <div className="search-box">
              <Search size={16} color="#9ca3af" />
              <input 
                placeholder="Search services..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div style={{ height: "24px", width: "1px", background: "#374151" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingRight: "8px" }}>
              <Filter size={14} color="#9ca3af" />
              <select 
                className="category-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {MAIN_SERVICES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <button className="add-btn" onClick={handleCreate}>
            <Plus size={18} />
            New Service
          </button>
        </div>

        {/* --- LOADING STATE --- */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "100px" }}>
            <Loader2 className="animate-spin" size={40} color="#3b82f6" />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="empty-state">
            <Search size={48} style={{ opacity: 0.3, marginBottom: "16px" }} />
            <h3>No services found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          /* --- SERVICE GRID --- */
          <div className="services-grid">
            {filteredServices.map((service) => (
              <div key={service.service_id} className="service-card">
                <div className="card-badge">{service.main_service}</div>
                
                <h3 className="card-title">{service.sub_service}</h3>
                <p className="card-desc" title={service.short_desc || "No description"}>
                  {service.short_desc || "No description provided."}
                </p>
                
                <div className="card-footer">
                  <div className="price-tag">
                    ₹{service.service_charge.toLocaleString()}
                  </div>
                  <div className="action-group">
                    <button 
                      className="icon-btn edit-btn" 
                      onClick={() => handleEdit(service)}
                      title="Edit Service"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      className="icon-btn delete-btn" 
                      onClick={() => handleDelete(service.service_id!)}
                      title="Delete Service"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- MODAL FORM --- */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingId ? "Edit Service" : "Add New Service"}</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  {/* Main Service Dropdown */}
                  <div className="form-group">
                    <label>Main Category</label>
                    <select 
                      className="form-select"
                      value={formData.main_service}
                      required
                      onChange={(e) => setFormData({...formData, main_service: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      {MAIN_SERVICES.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sub Service Name */}
                  <div className="form-group">
                    <label>Service Name (Sub Service)</label>
                    <input 
                      className="form-input"
                      placeholder="e.g., E-Commerce Website"
                      value={formData.sub_service}
                      required
                      onChange={(e) => setFormData({...formData, sub_service: e.target.value})}
                    />
                  </div>

                  {/* Pricing */}
                  <div className="form-group">
                    <label>Service Charge (₹)</label>
                    <input 
                      className="form-input"
                      type="number"
                      placeholder="0.00"
                      value={formData.service_charge}
                      required
                      onChange={(e) => setFormData({...formData, service_charge: Number(e.target.value)})}
                    />
                  </div>

                  {/* Short Desc */}
                  <div className="form-group">
                    <label>Short Description</label>
                    <textarea 
                      className="form-textarea"
                      rows={2}
                      placeholder="Brief summary..."
                      value={formData.short_desc}
                      onChange={(e) => setFormData({...formData, short_desc: e.target.value})}
                    />
                  </div>

                   {/* Long Desc */}
                   <div className="form-group">
                    <label>Full Description</label>
                    <textarea 
                      className="form-textarea"
                      rows={4}
                      placeholder="Detailed explanation..."
                      value={formData.long_desc}
                      onChange={(e) => setFormData({...formData, long_desc: e.target.value})}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle2 size={16}/>}
                    {editingId ? "Save Changes" : "Create Service"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Sidebar>
  );
}