import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import apiBaseUrl from "../apiBaseUrl";
import { 
  Search, 
  Filter, 
  Loader2, 
  Check, 
  X as XIcon, 
  Star, 
  Zap,
  Plus,
  Trash2,
  Edit3,
  X,
  CheckCircle2,
  PlusCircle,
  MinusCircle,
  IndianRupee
} from "lucide-react";

// --- TYPES ---
type Feature = { 
  label: string; 
  available: boolean 
};

type Pack = {
  name: string;
  price: string;
  period: string;
  features: Feature[];
  popular?: boolean;
};

type Pricing = {
  id?: number;
  main_service: string;
  service_pack_1: Pack;
  service_pack_2: Pack;
  service_pack_3: Pack;
};

// Empty state
const emptyPack: Pack = {
  name: "",
  price: "",
  period: "Month", 
  features: [{ label: "Feature 1", available: true }],
  popular: false
};

const emptyPricing: Pricing = {
  main_service: "",
  service_pack_1: { ...emptyPack, name: "Basic Plan" },
  service_pack_2: { ...emptyPack, name: "Standard Plan" },
  service_pack_3: { ...emptyPack, name: "Premium Plan" }
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

const PERIODS = ["Month", "Year", "Week", "Project", "One Time"];

export default function Pricing() {
  const [data, setData] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Pricing>(emptyPricing);
  const [activeTab, setActiveTab] = useState<"service_pack_1" | "service_pack_2" | "service_pack_3">("service_pack_1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Data
  const fetchPricing = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/admin/pricing`);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error("Pricing fetch failed:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  // --- ACTIONS ---
  const handleCreate = () => {
    setFormData(JSON.parse(JSON.stringify(emptyPricing)));
    setEditingId(null);
    setActiveTab("service_pack_1");
    setIsModalOpen(true);
  };

  const handleEdit = (pricing: Pricing) => {
    setFormData(JSON.parse(JSON.stringify(pricing)));
    setEditingId(pricing.id!);
    setActiveTab("service_pack_1");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEdit = editingId !== null;
    const url = isEdit
      ? `${apiBaseUrl}/admin/pricing/${editingId}`
      : `${apiBaseUrl}/admin/pricing`;

    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchPricing();
        setIsModalOpen(false);
      } else {
        const err = await res.json();
        alert(`Failed to save: ${err.error || "Unknown Error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure? This will delete this entire pricing plan.")) return;
    try {
      const res = await fetch(`${apiBaseUrl}/admin/pricing/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchPricing();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  // --- FORM HELPERS ---
  const updatePackField = (field: keyof Pack, value: any) => {
    setFormData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }));
  };

  // Logic to set current tab as popular and uncheck others
  const handleSetPopular = (isChecked: boolean) => {
    setFormData(prev => {
      const newState = { ...prev };
      
      // If setting to true, uncheck others
      if (isChecked) {
        newState.service_pack_1.popular = false;
        newState.service_pack_2.popular = false;
        newState.service_pack_3.popular = false;
      }
      
      // Set current
      newState[activeTab].popular = isChecked;
      return newState;
    });
  };

  const addFeature = () => {
    const currentFeatures = formData[activeTab].features || [];
    updatePackField("features", [...currentFeatures, { label: "New Feature", available: true }]);
  };

  const removeFeature = (index: number) => {
    const currentFeatures = formData[activeTab].features.filter((_, i) => i !== index);
    updatePackField("features", currentFeatures);
  };

  const updateFeature = (index: number, key: keyof Feature, value: any) => {
    const newFeatures = [...formData[activeTab].features];
    newFeatures[index] = { ...newFeatures[index], [key]: value };
    updatePackField("features", newFeatures);
  };

  // --- FILTER ---
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (filterCategory !== "All" && row.main_service !== filterCategory) return false;
      const lowerQuery = searchQuery.toLowerCase();
      if (row.main_service.toLowerCase().includes(lowerQuery)) return true;
      return [row.service_pack_1, row.service_pack_2, row.service_pack_3].some(p => 
        p?.name?.toLowerCase().includes(lowerQuery)
      );
    });
  }, [data, searchQuery, filterCategory]);

  return (
    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}>
      <div className="pricing-page">
        <style>{`
          .pricing-page { font-family: 'Poppins', sans-serif; color: white; min-height: 100vh; }
          .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; gap: 16px; flex-wrap: wrap; }
          .header-title h1 { font-size: 28px; font-weight: 700; margin: 0; color: white; }
          .toolbar { display: flex; gap: 12px; background: #1f2937; padding: 6px; border-radius: 12px; border: 1px solid #374151; align-items: center; }
          .search-box { display: flex; align-items: center; padding: 0 12px; gap: 8px; background: #111827; border-radius: 8px; height: 40px; }
          .search-box input { background: transparent; border: none; outline: none; color: white; font-size: 14px; width: 200px; }
          .category-select { background: #111827; color: #d1d5db; border: none; padding: 0 16px; height: 40px; border-radius: 8px; outline: none; cursor: pointer; }
          .add-btn { background: #2563eb; color: white; border: none; padding: 0 20px; height: 44px; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
          .add-btn:hover { background: #1d4ed8; }

          .service-section { margin-bottom: 48px; }
          .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #374151; padding-bottom: 10px; }
          .section-title { font-size: 20px; font-weight: 600; color: #e5e7eb; display: flex; align-items: center; gap: 10px; }
          
          .pricing-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
          .pricing-card { background: #1f2937; border: 1px solid #374151; border-radius: 16px; padding: 24px; position: relative; display: flex; flex-direction: column; transition: 0.2s; }
          .pricing-card:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(0,0,0,0.3); border-color: #4b5563; }
          .pricing-card.is-popular { border-color: #eab308; box-shadow: 0 0 20px rgba(234, 179, 8, 0.1); }
          .popular-badge { position: absolute; top: -12px; right: 20px; background: #eab308; color: #1f2937; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; display: flex; align-items: center; gap: 4px; }
          .pack-name { font-size: 18px; font-weight: 700; color: white; margin: 0 0 4px 0; }
          .pack-price { font-size: 28px; font-weight: 700; color: #3b82f6; margin-bottom: 4px; }
          .pack-period { font-size: 13px; color: #9ca3af; margin-bottom: 20px; }
          .features-list { list-style: none; padding: 0; margin: 0 0 24px 0; flex-grow: 1; }
          .feature-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #d1d5db; margin-bottom: 10px; }
          
          .action-btn { width: 100%; padding: 10px; border-radius: 8px; font-weight: 600; border: 1px solid #374151; background: transparent; color: #9ca3af; cursor: pointer; display: flex; justify-content: center; gap: 8px; }
          .action-btn:hover { background: #374151; color: white; }
          .action-btn.active { background: rgba(234, 179, 8, 0.15); color: #eab308; border-color: rgba(234, 179, 8, 0.3); }

          .icon-btn { width: 32px; height: 32px; border-radius: 6px; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }
          .edit-btn { background: #374151; color: #9ca3af; }
          .edit-btn:hover { background: #2563eb; color: white; }
          .delete-btn { background: #374151; color: #9ca3af; }
          .delete-btn:hover { background: #ef4444; color: white; }

          /* MODAL */
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
          .modal-content { background: #1f2937; border: 1px solid #374151; width: 100%; max-width: 700px; max-height: 90vh; display: flex; flex-direction: column; border-radius: 16px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); }
          .modal-header { padding: 20px 24px; border-bottom: 1px solid #374151; display: flex; justify-content: space-between; align-items: center; }
          .modal-body { padding: 24px; overflow-y: auto; }
          .modal-footer { padding: 16px 24px; border-top: 1px solid #374151; display: flex; justify-content: flex-end; gap: 12px; }
          .form-group { margin-bottom: 16px; }
          .form-group label { display: block; font-size: 13px; color: #d1d5db; margin-bottom: 6px; }
          .form-input { width: 100%; background: #111827; border: 1px solid #374151; color: white; padding: 10px; border-radius: 8px; outline: none; box-sizing: border-box; }
          .form-input:focus { border-color: #3b82f6; }
          
          .tabs { display: flex; gap: 4px; background: #111827; padding: 4px; border-radius: 8px; margin-bottom: 20px; }
          .tab { flex: 1; padding: 8px; text-align: center; cursor: pointer; border-radius: 6px; font-size: 13px; font-weight: 500; color: #9ca3af; transition: 0.2s; }
          .tab.active { background: #374151; color: white; }
          
          .feature-row { display: flex; gap: 10px; margin-bottom: 8px; align-items: center; }
          .feature-check { width: 20px; height: 20px; cursor: pointer; }
          .remove-feat { background: none; border: none; color: #ef4444; cursor: pointer; }
          .add-feat-btn { background: none; border: 1px dashed #374151; color: #3b82f6; width: 100%; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 13px; }
          .add-feat-btn:hover { background: rgba(59, 130, 246, 0.1); }
          .save-btn { background: #2563eb; color: white; border: none; padding: 8px 24px; border-radius: 8px; font-weight: 500; cursor: pointer; display: flex; gap: 8px; align-items: center; }
          
          .checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #eab308; cursor: pointer; font-weight: 500; margin-top: 10px; }
          .checkbox-input { accent-color: #eab308; width: 16px; height: 16px; }
        `}</style>

        {/* HEADER */}
        <div className="page-header">
          <div className="header-title"><h1>Pricing Management</h1></div>
          <div className="toolbar">
            <div className="search-box">
              <Search size={16} color="#9ca3af" />
              <input placeholder="Search pricing..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div style={{ height: "24px", width: "1px", background: "#374151" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingRight: "8px" }}>
              <Filter size={14} color="#9ca3af" />
              <select className="category-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="All">All Services</option>
                {MAIN_SERVICES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <button className="add-btn" onClick={handleCreate}><Plus size={18} /> New Pricing</button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "100px" }}><Loader2 className="animate-spin" size={40} color="#3b82f6" /></div>
        ) : filteredData.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>
            <Search size={48} style={{ opacity: 0.3, marginBottom: "16px", margin: "0 auto" }} />
            <h3>No pricing plans found</h3>
          </div>
        ) : (
          filteredData.map((row) => (
            <div key={row.id} className="service-section">
              <div className="section-header">
                <div className="section-title"><Zap size={20} color="#eab308" /> {row.main_service}</div>
                <div className="section-actions">
                  <button className="icon-btn edit-btn" onClick={() => handleEdit(row)}><Edit3 size={16} /></button>
                  <button className="icon-btn delete-btn" onClick={() => handleDelete(row.id!)}><Trash2 size={16} /></button>
                </div>
              </div>

              <div className="pricing-grid">
                {[row.service_pack_1, row.service_pack_2, row.service_pack_3].map((pack, index) => {
                  return pack ? (
                    <div key={index} className={`pricing-card ${pack.popular ? "is-popular" : ""}`}>
                      {pack.popular && <div className="popular-badge"><Star size={10} fill="currentColor" /> POPULAR</div>}
                      <h4 className="pack-name">{pack.name}</h4>
                      <div className="pack-price"><span style={{ fontSize: "20px" }}>₹</span>{pack.price}</div>
                      <div className="pack-period">/ {pack.period || "Month"}</div>
                      <ul className="features-list">
                        {pack.features?.map((f, i) => (
                          <li key={i} className="feature-item">
                            {f.available ? <Check size={16} className="icon-check" /> : <XIcon size={16} className="icon-cross" />}
                            <span style={{ opacity: f.available ? 1 : 0.5 }}>{f.label}</span>
                          </li>
                        ))}
                      </ul>
                      <button className={`action-btn ${pack.popular ? "active" : ""}`} onClick={() => handleEdit(row)}>
                        {pack.popular ? <><Star size={16} fill="currentColor" /> Popular Plan</> : <><Star size={16} /> Mark as Popular</>}
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          ))
        )}

        {/* MODAL */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 style={{ margin: 0, color: "white" }}>{editingId ? "Edit Pricing Plan" : "New Pricing Plan"}</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }}><X size={20} /></button>
              </div>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Main Category</label>
                    <select className="form-input" value={formData.main_service} onChange={(e) => setFormData({ ...formData, main_service: e.target.value })} required>
                      <option value="">Select Service</option>
                      {MAIN_SERVICES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>

                  <div className="tabs">
                    <div className={`tab ${activeTab === "service_pack_1" ? "active" : ""}`} onClick={() => setActiveTab("service_pack_1")}>Pack 1</div>
                    <div className={`tab ${activeTab === "service_pack_2" ? "active" : ""}`} onClick={() => setActiveTab("service_pack_2")}>Pack 2</div>
                    <div className={`tab ${activeTab === "service_pack_3" ? "active" : ""}`} onClick={() => setActiveTab("service_pack_3")}>Pack 3</div>
                  </div>

                  <div className="form-group">
                    <label>Pack Name</label>
                    <input className="form-input" value={formData[activeTab].name} onChange={(e) => updatePackField("name", e.target.value)} />
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="form-group">
                      <label>Price (₹)</label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "10px", color: "#9ca3af" }}>₹</span>
                        <input className="form-input" style={{ paddingLeft: "28px" }} value={formData[activeTab].price} onChange={(e) => updatePackField("price", e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Period</label>
                      <select className="form-input" value={formData[activeTab].period} onChange={(e) => updatePackField("period", e.target.value)}>
                        {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>

                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      className="checkbox-input"
                      checked={formData[activeTab].popular || false} 
                      onChange={(e) => handleSetPopular(e.target.checked)} 
                    />
                    Mark as Most Popular Plan
                  </label>

                  <div className="form-group" style={{ marginTop: "16px" }}>
                    <label>Features</label>
                    {formData[activeTab].features.map((feat, i) => (
                      <div key={i} className="feature-row">
                        <input type="checkbox" className="feature-check" checked={feat.available} onChange={(e) => updateFeature(i, "available", e.target.checked)} />
                        <input className="form-input" style={{ padding: "6px 10px", fontSize: "13px" }} value={feat.label} onChange={(e) => updateFeature(i, "label", e.target.value)} />
                        <button type="button" className="remove-feat" onClick={() => removeFeature(i)}><MinusCircle size={18} /></button>
                      </div>
                    ))}
                    <button type="button" className="add-feat-btn" onClick={addFeature}><PlusCircle size={14} style={{ display: "inline", marginBottom: "-2px" }} /> Add Feature</button>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="save-btn" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />} Save Pricing
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