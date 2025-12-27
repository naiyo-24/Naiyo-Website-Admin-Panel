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
  Layout, 
  Image as ImageIcon,
  ExternalLink
} from "lucide-react";

// --- TYPES ---
type Project = {
  id?: number;
  title: string;
  description: string;
  category: string;
  images: string;
  technologies: string;
  status: string;
  website: string;
};

const emptyProject: Project = {
  title: "",
  description: "",
  category: "Web Development",
  images: "",
  technologies: "",
  status: "Completed",
  website: ""
};

const CATEGORIES = [
  "Web Development",
  "App Development",
  "UI/UX Design",
  "Marketing",
  "SEO",
  "Other"
];

export default function OurProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Project>(emptyProject);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= FETCH DATA ================= */
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/admin/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ================= ACTIONS ================= */
  const handleCreate = () => {
    setFormData(emptyProject);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setFormData(project);
    setEditingId(project.id!);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEdit = editingId !== null;
    const url = isEdit
      ? `${apiBaseUrl}/admin/projects/${editingId}`
      : `${apiBaseUrl}/admin/projects`;

    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchProjects();
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
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const res = await fetch(`${apiBaseUrl}/admin/projects/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        const errData = await res.json();
        alert(`Failed to delete: ${errData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Network Error");
    }
  };

  /* ================= COMPUTED ================= */
  const filteredProjects = useMemo(() => {
    const lowerQ = searchQuery.toLowerCase();
    return projects.filter((p) => 
      p.title.toLowerCase().includes(lowerQ) ||
      p.category.toLowerCase().includes(lowerQ)
    );
  }, [projects, searchQuery]);

  return (
    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}>
      <div className="projects-page">
        <style>{`
          .projects-page { font-family: 'Poppins', sans-serif; color: white; min-height: 100vh; }
          
          /* HEADER */
          .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
          .header-title h1 { font-size: 28px; font-weight: 700; margin: 0; background: linear-gradient(90deg, #fff, #9ca3af); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          
          .toolbar { display: flex; gap: 12px; background: #1f2937; padding: 6px; border-radius: 12px; border: 1px solid #374151; align-items: center; }
          .search-box { display: flex; align-items: center; padding: 0 12px; gap: 8px; background: #111827; border-radius: 8px; height: 40px; }
          .search-box input { background: transparent; border: none; outline: none; color: white; font-size: 14px; width: 220px; }

          .add-btn { background: #2563eb; color: white; border: none; padding: 0 20px; height: 44px; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
          .add-btn:hover { background: #1d4ed8; transform: translateY(-1px); }

          /* GRID LAYOUT */
          .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }

          /* CARD */
          .project-card { background: #1f2937; border: 1px solid #374151; border-radius: 16px; padding: 20px; transition: 0.25s; display: flex; flex-direction: column; overflow: hidden; }
          .project-card:hover { transform: translateY(-5px); border-color: #4b5563; box-shadow: 0 15px 30px rgba(0,0,0,0.3); }

          .card-image-placeholder { width: 100%; height: 160px; background: #111827; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; position: relative; overflow: hidden; }
          .card-image-placeholder img { width: 100%; height: 100%; object-fit: cover; }
          .placeholder-icon { color: #374151; }

          .status-badge { position: absolute; top: 10px; right: 10px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); }
          .status-completed { color: #34d399; border: 1px solid #34d399; }
          .status-ongoing { color: #fbbf24; border: 1px solid #fbbf24; }

          .category-tag { font-size: 12px; color: #60a5fa; font-weight: 600; margin-bottom: 4px; display: block; }
          .project-title { font-size: 18px; font-weight: 700; color: white; margin: 0 0 4px 0; }
          .tech-stack { font-size: 12px; color: #9ca3af; margin-bottom: 12px; }

          .project-desc { font-size: 13px; color: #d1d5db; line-height: 1.5; margin-bottom: 16px; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

          .card-actions { border-top: 1px solid #374151; paddingTop: 16px; display: flex; gap: 10px; margin-top: auto; padding-top: 16px; }
          .action-btn { flex: 1; padding: 8px; border-radius: 8px; border: 1px solid #374151; background: transparent; color: #9ca3af; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: 0.2s; }
          .action-btn:hover { background: #374151; color: white; }
          .action-btn.delete:hover { border-color: #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.1); }
          .link-btn { text-decoration: none; color: inherit; display: flex; align-items: center; gap: 6px; }

          /* MODAL */
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
          .modal-content { background: #1f2937; border: 1px solid #374151; width: 100%; max-width: 600px; border-radius: 16px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); animation: slideUp 0.3s ease; }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          
          .modal-header { padding: 20px 24px; border-bottom: 1px solid #374151; display: flex; justify-content: space-between; align-items: center; }
          .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
          
          .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .form-group label { display: block; font-size: 13px; color: #d1d5db; margin-bottom: 6px; }
          .form-input, .form-select, .form-textarea { width: 100%; background: #111827; border: 1px solid #374151; color: white; padding: 10px 14px; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box; }
          .form-input:focus, .form-textarea:focus { border-color: #3b82f6; }

          .modal-footer { padding: 16px 24px; border-top: 1px solid #374151; display: flex; justify-content: flex-end; gap: 12px; }
          .cancel-btn { background: transparent; color: #d1d5db; border: 1px solid #374151; padding: 8px 16px; border-radius: 8px; cursor: pointer; }
          .save-btn { background: #2563eb; color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 6px; }
          
          .empty-state { text-align: center; padding: 60px; color: #6b7280; }
        `}</style>

        {/* --- PAGE HEADER --- */}
        <div className="page-header">
          <div className="header-title">
            <h1>Our Projects</h1>
          </div>
          <div className="toolbar">
            <div className="search-box">
              <Search size={16} color="#9ca3af" />
              <input 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <button className="add-btn" onClick={handleCreate}>
            <Plus size={18} /> Add Project
          </button>
        </div>

        {/* --- CONTENT --- */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "100px" }}>
            <Loader2 className="animate-spin" size={40} color="#3b82f6" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">
            <Layout size={48} style={{ opacity: 0.3, marginBottom: "16px", margin: "0 auto" }} />
            <h3>No projects found</h3>
            <p>Showcase your work by adding a new project.</p>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div key={project.id} className="project-card">
                {/* Image Area */}
                <div className="card-image-placeholder">
                  {project.images ? (
                    <img src={project.images} alt={project.title} onError={(e) => (e.currentTarget.src = "")} />
                  ) : (
                    <ImageIcon size={32} className="placeholder-icon" />
                  )}
                  <div className={`status-badge ${project.status === "Completed" ? "status-completed" : "status-ongoing"}`}>
                    {project.status}
                  </div>
                </div>

                <span className="category-tag">{project.category}</span>
                <h3 className="project-title">{project.title}</h3>
                <div className="tech-stack">
                   {project.technologies || "No tech stack specified"}
                </div>
                
                <p className="project-desc">
                  {project.description || "No description provided."}
                </p>

                <div className="card-actions">
                  {project.website && (
                    <a href={project.website} target="_blank" rel="noreferrer" className="action-btn link-btn">
                      <Globe size={16} /> Live Link <ExternalLink size={10} />
                    </a>
                  )}
                  <button className="action-btn" onClick={() => handleEdit(project)}>
                    <Edit3 size={16} /> Edit
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(project.id!)}>
                    <Trash2 size={16} />
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
                <h3 style={{ margin: 0, color: "white" }}>{editingId ? "Edit Project" : "New Project"}</h3>
                <button style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }} onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Project Title</label>
                    <input className="form-input" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <select className="form-select" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select className="form-select" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                        <option value="Completed">Completed</option>
                        <option value="Ongoing">Ongoing</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                      <label>Technologies Used</label>
                      <input className="form-input" placeholder="e.g. React, Python, AWS" value={formData.technologies} onChange={(e) => setFormData({...formData, technologies: e.target.value})} />
                  </div>

                  <div className="form-group">
                    <label>Image URL</label>
                    <input className="form-input" placeholder="https://example.com/image.jpg" value={formData.images} onChange={(e) => setFormData({...formData, images: e.target.value})} />
                  </div>

                  <div className="form-group">
                    <label>Live Website URL</label>
                    <input className="form-input" placeholder="https://myproject.com" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-textarea" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="save-btn" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                    {editingId ? "Save Changes" : "Create Project"}
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