import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import apiBaseUrl from "../apiBaseUrl";
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Loader2, 
  CheckCircle2, 
  Globe,
  Building2,
  ExternalLink
} from "lucide-react";

// --- TYPES ---
type Partner = {
  id?: number;
  name: string;
  initials: string;
  short_desc: string;
  color: string;
  website: string;
  logo: string | null;
};

const emptyPartner: Partner = {
  name: "",
  initials: "",
  short_desc: "",
  color: "#3b82f6", // Default blue
  website: "",
  logo: null,
};

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partner>(emptyPartner);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= FETCH DATA ================= */
  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/admin/partner_companies`);
      if (res.ok) {
        const data = await res.json();
        setPartners(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch partners:", err);
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  /* ================= COMPUTED DATA ================= */
  const filteredPartners = useMemo(() => {
    const lowerQ = searchQuery.toLowerCase();
    return partners.filter((p) => 
      p.name.toLowerCase().includes(lowerQ) ||
      (p.initials && p.initials.toLowerCase().includes(lowerQ))
    );
  }, [partners, searchQuery]);

  /* ================= ACTIONS ================= */
  const handleCreate = () => {
    setFormData(emptyPartner);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setFormData(partner);
    setEditingId(partner.id!);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEdit = editingId !== null;
    const url = isEdit
      ? `${apiBaseUrl}/admin/partner_companies/${editingId}`
      : `${apiBaseUrl}/admin/partner_companies`;

    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchPartners();
        setIsModalOpen(false);
      } else {
        const errData = await res.json();
        alert(`Failed to save: ${errData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this partner?")) return;

    try {
      const res = await fetch(`${apiBaseUrl}/admin/partner_companies/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPartners((prev) => prev.filter((p) => p.id !== id));
      } else {
        const errData = await res.json();
        alert(`Failed to delete: ${errData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Network Error");
    }
  };

  return (
    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}>
      <div className="partners-page">
        {/* STYLES */}
        <style>{`
          .partners-page { font-family: 'Poppins', sans-serif; color: white; min-height: 100vh; }

          /* HEADER */
          .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
          .header-title h1 { font-size: 28px; font-weight: 700; margin: 0; background: linear-gradient(90deg, #fff, #9ca3af); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          
          .toolbar { display: flex; gap: 12px; background: #1f2937; padding: 6px; border-radius: 12px; border: 1px solid #374151; align-items: center; }
          .search-box { display: flex; align-items: center; padding: 0 12px; gap: 8px; background: #111827; border-radius: 8px; height: 40px; border: 1px solid transparent; transition: 0.2s; }
          .search-box:focus-within { border-color: #3b82f6; }
          .search-box input { background: transparent; border: none; outline: none; color: white; font-size: 14px; width: 220px; }

          .add-btn { background: #2563eb; color: white; border: none; padding: 0 20px; height: 44px; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
          .add-btn:hover { background: #1d4ed8; transform: translateY(-1px); }

          /* GRID */
          .partners-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
          
          .partner-card { background: #1f2937; border: 1px solid #374151; border-radius: 16px; padding: 24px; transition: all 0.25s ease; position: relative; display: flex; flex-direction: column; }
          .partner-card:hover { transform: translateY(-5px); border-color: #4b5563; box-shadow: 0 12px 24px rgba(0,0,0,0.3); }

          /* AVATAR/LOGO AREA */
          .card-header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
          .partner-avatar { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.2); }
          
          .partner-info h3 { margin: 0; font-size: 18px; font-weight: 600; color: white; }
          .partner-website { font-size: 13px; color: #3b82f6; text-decoration: none; display: flex; align-items: center; gap: 4px; margin-top: 4px; }
          .partner-website:hover { text-decoration: underline; }

          .card-desc { font-size: 13px; color: #9ca3af; line-height: 1.5; margin-bottom: 20px; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

          /* ACTIONS */
          .card-actions { display: flex; gap: 10px; border-top: 1px solid #374151; padding-top: 16px; margin-top: auto; }
          .action-btn { flex: 1; padding: 8px; border-radius: 8px; border: 1px solid #374151; background: transparent; color: #9ca3af; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: 0.2s; }
          .action-btn:hover { background: #374151; color: white; }
          .action-btn.delete:hover { background: rgba(239, 68, 68, 0.15); color: #ef4444; border-color: rgba(239, 68, 68, 0.3); }

          /* MODAL */
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
          .modal-content { background: #1f2937; border: 1px solid #374151; width: 100%; max-width: 500px; border-radius: 16px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); animation: slideUp 0.3s ease; }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          
          .modal-header { padding: 20px 24px; border-bottom: 1px solid #374151; display: flex; justify-content: space-between; align-items: center; }
          .modal-header h3 { margin: 0; color: white; font-size: 18px; }
          .close-btn { background: none; border: none; color: #9ca3af; cursor: pointer; }
          .close-btn:hover { color: white; }

          .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
          .form-group label { display: block; font-size: 13px; color: #d1d5db; margin-bottom: 6px; }
          .form-input, .form-textarea { width: 100%; background: #111827; border: 1px solid #374151; color: white; padding: 10px 14px; border-radius: 8px; font-size: 14px; outline: none; transition: 0.2s; box-sizing: border-box; }
          .form-input:focus, .form-textarea:focus { border-color: #3b82f6; }
          .color-input { height: 42px; padding: 4px 8px; cursor: pointer; }

          .modal-footer { padding: 16px 24px; border-top: 1px solid #374151; display: flex; justify-content: flex-end; gap: 12px; }
          .cancel-btn { background: transparent; color: #d1d5db; border: 1px solid #374151; padding: 8px 16px; border-radius: 8px; cursor: pointer; }
          .save-btn { background: #2563eb; color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 6px; }
          .save-btn:disabled { opacity: 0.7; cursor: not-allowed; }

          .empty-state { text-align: center; padding: 60px; color: #6b7280; }
        `}</style>

        {/* --- PAGE HEADER --- */}
        <div className="page-header">
          <div className="header-title">
            <h1>Partner Companies</h1>
          </div>
          <div className="toolbar">
            <div className="search-box">
              <Search size={16} color="#9ca3af" />
              <input 
                placeholder="Search partners..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <button className="add-btn" onClick={handleCreate}>
            <Plus size={18} /> Add Partner
          </button>
        </div>

        {/* --- CONTENT --- */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "100px" }}>
            <Loader2 className="animate-spin" size={40} color="#3b82f6" />
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="empty-state">
            <Building2 size={48} style={{ opacity: 0.3, marginBottom: "16px", margin: "0 auto" }} />
            <h3>No partners found</h3>
            <p>Get started by adding a new partner company.</p>
          </div>
        ) : (
          <div className="partners-grid">
            {filteredPartners.map((partner) => (
              <div key={partner.id} className="partner-card">
                <div className="card-header">
                  <div 
                    className="partner-avatar" 
                    style={{ backgroundColor: partner.color || "#3b82f6" }}
                  >
                    {partner.initials}
                  </div>
                  <div className="partner-info">
                    <h3>{partner.name}</h3>
                    {partner.website && (
                      <a href={partner.website} target="_blank" rel="noreferrer" className="partner-website">
                        <Globe size={12} /> {partner.website.replace(/^https?:\/\//, '')} <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>

                <p className="card-desc">
                  {partner.short_desc || "No description provided."}
                </p>

                <div className="card-actions">
                  <button className="action-btn" onClick={() => handleEdit(partner)}>
                    <Edit3 size={16} /> Edit
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(partner.id!)}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- MODAL --- */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingId ? "Edit Partner" : "Add New Partner"}</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input 
                      className="form-input" 
                      required 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="form-group">
                      <label>Initials (2-3 chars)</label>
                      <input 
                        className="form-input" 
                        maxLength={4}
                        required 
                        value={formData.initials} 
                        onChange={(e) => setFormData({...formData, initials: e.target.value.toUpperCase()})}
                        placeholder="AC"
                      />
                    </div>
                    <div className="form-group">
                      <label>Brand Color</label>
                      <input 
                        type="color"
                        className="form-input color-input" 
                        value={formData.color} 
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Website URL</label>
                    <input 
                      className="form-input" 
                      value={formData.website} 
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>Short Description</label>
                    <textarea 
                      className="form-textarea" 
                      rows={3}
                      value={formData.short_desc} 
                      onChange={(e) => setFormData({...formData, short_desc: e.target.value})}
                      placeholder="Brief details about the partnership..."
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                    {editingId ? "Save Changes" : "Add Partner"}
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