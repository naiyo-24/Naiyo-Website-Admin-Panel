import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  Users,
  ShoppingBag,
  Briefcase,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  Quote,
  Folder,
} from "lucide-react";

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

export default function Sidebar({
  collapsed,
  setCollapsed,
  children,
}: SidebarProps) {
  return (
    <>
      <style>{`
        body { margin: 0; background: #111827; } /* Force dark background */
        
        .app-container {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          position: fixed;
          top: 0; left: 0;
          height: 100vh;
          width: 250px;
          background: #1f2937; /* Lighter dark for sidebar */
          border-right: 1px solid #374151;
          color: white;
          padding: 20px 15px;
          transition: width 0.3s ease;
          z-index: 50;
        }

        .sidebar.collapsed { width: 80px; }

        .main-content {
          margin-left: ${collapsed ? "80px" : "250px"};
          width: calc(100% - ${collapsed ? "80px" : "250px"});
          padding: 32px;
          background: #111827;
          min-height: 100vh;
          transition: margin-left 0.3s ease, width 0.3s ease;
        }

        .toggle-btn {
          width: 100%;
          background: #374151;
          border: none;
          color: white;
          padding: 8px;
          border-radius: 8px;
          margin-bottom: 24px;
          cursor: pointer;
          display: flex;
          justify-content: ${collapsed ? "center" : "flex-end"};
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          margin-bottom: 8px;
          border-radius: 12px;
          text-decoration: none;
          color: #9ca3af;
          transition: 0.2s;
        }

        .menu-item:hover { background: #374151; color: white; }
        .menu-item.active { background: #2563eb; color: white; }
        
        .menu-text {
          opacity: ${collapsed ? 0 : 1};
          white-space: nowrap;
          transition: opacity 0.2s;
          display: ${collapsed ? "none" : "block"};
        }
      `}</style>

      <div className="app-container">
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
          <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          <nav>
            <NavLink to="/dashboard" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span className="menu-text">Dashboard</span>
            </NavLink>

            <NavLink to="/services" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <Layers size={20} />
              <span className="menu-text">Services</span>
            </NavLink>

            <NavLink to="/partners" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <Briefcase size={20} />
              <span className="menu-text">Partners</span>
            </NavLink>

            <NavLink to="/clients" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <Users size={20} />
              <span className="menu-text">Clients</span>
            </NavLink>

            <NavLink to="/ourprojects" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <Folder size={20} />
              <span className="menu-text">Our Projects</span>
            </NavLink>


            <NavLink to="/pricing" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <IndianRupee size={20} />
              <span className="menu-text">Pricing</span>
            </NavLink>

            <NavLink to="/testimonials" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <Quote size={20} />
              <span className="menu-text">Testimonials</span>
            </NavLink>

          </nav>
        </aside>

        <main className="main-content">
          {children}
        </main>
      </div>
    </>
  );
}