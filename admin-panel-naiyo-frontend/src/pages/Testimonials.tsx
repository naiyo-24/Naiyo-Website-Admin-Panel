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
  Star, 
  Quote, 
  User,
  MessageSquareQuote
} from "lucide-react";

// --- TYPES MATCHING YOUR BACKEND ---
type Testimonial = {
  id?: number;
  name: string;      // Backend: name
  role: string;      // Backend: role
  company: string;   // Backend: company
  content: string;   // Backend: content
  rating: number;    // Backend: rating
};

const emptyTestimonial: Testimonial = {
  name: "",
  role: "",
  company: "",
  content: "",
  rating: 5,
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Testimonial>(emptyTestimonial);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= FETCH DATA ================= */
  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      // FIX: Changed endpoint to match your backend
      const res = await fetch(`${apiBaseUrl}/get_testimonials`);
      if (res.ok) {
        const data = await res.json();
        setTestimonials(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  /* ================= ACTIONS ================= */
  const handleCreate = () => {
    setFormData(emptyTestimonial);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (t: Testimonial) => {
    setFormData(t);
    setEditingId(t.id!);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEdit = editingId !== null;
    
    // FIX: Changed endpoints to match your backend structure
    const url = isEdit
      ? `${apiBaseUrl}/update_testimonial/${editingId}`
      : `${apiBaseUrl}/add_testimonial`;

    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchTestimonials();
        setIsModalOpen(false);
      } else {
        alert("Failed to save testimonial");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      // FIX: Changed endpoint to match your backend
      const res = await fetch(`${apiBaseUrl}/delete_testimonial/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  /* ================= COMPUTED ================= */
  const filteredTestimonials = useMemo(() => {
    const lowerQ = searchQuery.toLowerCase();
    return testimonials.filter((t) => 
      t.name.toLowerCase().includes(lowerQ) ||
      t.company.toLowerCase().includes(lowerQ)
    );
  }, [testimonials, searchQuery]);

  // Helper to render stars
  const renderStars = (count: number) => {
    return (
      <div style={{ display: "flex", gap: "2px", color: "#eab308" }}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill={i < count ? "currentColor" : "none"} strokeWidth={i < count ? 0 : 2} style={{ opacity: i < count ? 1 : 0.3 }} />
        ))}
      </div>
    );
  };

  return (
    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}>
      <div className="testimonials-page">
        <style>{`
          .testimonials-page { font-family: 'Poppins', sans-serif; color: white; min-height: 100vh; }
          
          /* HEADER */
          .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
          .header-title h1 { font-size: 28px; font-weight: 700; margin: 0; background: linear-gradient(90deg, #fff, #9ca3af); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          
          .toolbar { display: flex; gap: 12px; background: #1f2937; padding: 6px; border-radius: 12px; border: 1px solid #374151; align-items: center; }
          .search-box { display: flex; align-items: center; padding: 0 12px; gap: 8px; background: #111827; border-radius: 8px; height: 40px; }
          .search-box input { background: transparent; border: none; outline: none; color: white; font-size: 14px; width: 220px; }

          .add-btn { background: #2563eb; color: white; border: none; padding: 0 20px; height: 44px; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
          .add-btn:hover { background: #1d4ed8; transform: translateY(-1px); }

          /* GRID */
          .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }

          /* CARD */
          .review-card { background: #1f2937; border: 1px solid #374151; border-radius: 16px; padding: 24px; transition: 0.25s; display: flex; flex-direction: column; position: relative; }
          .review-card:hover { transform: translateY(-5px); border-color: #4b5563; box-shadow: 0 15px 30px rgba(0,0,0,0.3); }

          .quote-icon { position: absolute; top: 20px; right: 20px; color: rgba(255,255,255,0.05); }

          .client-header { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
          .avatar-placeholder { width: 48px; height: 48px; border-radius: 50%; background: #374151; display: flex; align-items: center; justify-content: center; color: #9ca3af; }

          .client-info h3 { font-size: 16px; font-weight: 600; color: white; margin: 0; }
          .client-info span { font-size: 12px; color: #9ca3af; display: block; margin-top: 2px; }

          .rating-row { margin-bottom: 12px; }
          
          .review-text { font-size: 14px; color: #d1d5db; line-height: 1.6; font-style: italic; margin-bottom: 20px; flex-grow: 1; }

          .card-actions { border-top: 1px solid #374151; padding-top: 16px; display: flex; gap: 10px; margin-top: auto; }
          .action-btn { flex: 1; padding: 8px; border-radius: 8px; border: 1px solid #374151; background: transparent; color: #9ca3af; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: 0.2s; }
          .action-btn:hover { background: #374151; color: white; }
          .action-btn.delete:hover { border-color: #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.1); }

          /* MODAL */
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
          .modal-content { background: #1f2937; border: 1px solid #374151; width: 100%; max-width: 500px; border-radius: 16px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); animation: slideUp 0.3s ease; }
          
          .modal-header { padding: 20px 24px; border-bottom: 1px solid #374151; display: flex; justify-content: space-between; align-items: center; }
          .modal-header h3 { margin: 0; color: white; font-size: 18px; }
          
          .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
          
          .form-group label { display: block; font-size: 13px; color: #d1d5db; margin-bottom: 6px; }
          .form-input, .form-textarea, .form-select { width: 100%; background: #111827; border: 1px solid #374151; color: white; padding: 10px 14px; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box; }
          .form-input:focus { border-color: #3b82f6; }

          .modal-footer { padding: 16px 24px; border-top: 1px solid #374151; display: flex; justify-content: flex-end; gap: 12px; }
          .cancel-btn { background: transparent; color: #d1d5db; border: 1px solid #374151; padding: 8px 16px; border-radius: 8px; cursor: pointer; }
          .save-btn { background: #2563eb; color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 6px; }

          .empty-state { text-align: center; padding: 60px; color: #6b7280; }
        `}</style>

        {/* --- PAGE HEADER --- */}
        <div className="page-header">
          <div className="header-title">
            <h1>Testimonials</h1>
          </div>
          <div className="toolbar">
            <div className="search-box">
              <Search size={16} color="#9ca3af" />
              <input 
                placeholder="Search name, company..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <button className="add-btn" onClick={handleCreate}>
            <Plus size={18} /> Add Review
          </button>
        </div>

        {/* --- CONTENT --- */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "100px" }}>
            <Loader2 className="animate-spin" size={40} color="#3b82f6" />
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="empty-state">
            <MessageSquareQuote size={48} style={{ opacity: 0.3, marginBottom: "16px", margin: "0 auto" }} />
            <h3>No testimonials found</h3>
            <p>Add the first client review to build trust.</p>
          </div>
        ) : (
          <div className="testimonials-grid">
            {filteredTestimonials.map((t) => (
              <div key={t.id} className="review-card">
                <Quote size={48} className="quote-icon" />
                
                <div className="client-header">
                  <div className="avatar-placeholder">
                    {t.name ? t.name.charAt(0).toUpperCase() : <User size={24} />}
                  </div>
                  <div className="client-info">
                    <h3>{t.name}</h3>
                    <span>{t.role} at {t.company}</span>
                  </div>
                </div>

                <div className="rating-row">
                  {renderStars(t.rating)}
                </div>

                <div className="review-text">
                  "{t.content}"
                </div>

                <div className="card-actions">
                  <button className="action-btn" onClick={() => handleEdit(t)}>
                    <Edit3 size={16} /> Edit
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(t.id!)}>
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
                <h3 style={{ margin: 0, color: "white" }}>{editingId ? "Edit Testimonial" : "New Testimonial"}</h3>
                <button style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }} onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Client Name</label>
                    <input className="form-input" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="form-group">
                      <label>Role</label>
                      <input className="form-input" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} placeholder="e.g. CEO" />
                    </div>
                    <div className="form-group">
                      <label>Company</label>
                      <input className="form-input" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
                    </div>
                  </div>

                  <div className="form-group">
                     <label>Rating (1-5)</label>
                     <select className="form-select" value={formData.rating} onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}>
                       <option value={5}>5 Stars - Excellent</option>
                       <option value={4}>4 Stars - Very Good</option>
                       <option value={3}>3 Stars - Good</option>
                       <option value={2}>2 Stars - Fair</option>
                       <option value={1}>1 Star - Poor</option>
                     </select>
                  </div>

                  <div className="form-group">
                    <label>Review Content</label>
                    <textarea className="form-textarea" required rows={4} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="save-btn" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                    {editingId ? "Save Changes" : "Add Review"}
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