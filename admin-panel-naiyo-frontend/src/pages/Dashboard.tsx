import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import apiBaseUrl from "../apiBaseUrl";
import {
  Layers,
  Briefcase,
  Users,
  Search,
  Calendar,
  DollarSign,
  Star,
  ArrowUpRight,
  TrendingUp,
  X,
  FileText,
  Download
} from "lucide-react";

// Import PDF Libraries
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Import Charts
import LeadGrowthChart from "../components/LeadGrowthChart";
import ServiceDistributionChart from "../components/ServiceDistributionChart";
import ProjectStatsChart from "../components/ProjectStatsChart";
import RatingsChart from "../components/RatingsChart";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // --- DATA STATE (Summary Counts) ---
  const [counts, setCounts] = useState({ services: 0, partners: 0, clients: 0, projects: 0, revenue: 0, avgRating: 0 });
  
  // --- DATA STATE (Charts) ---
  const [leadChartData, setLeadChartData] = useState<any[]>([]);
  const [serviceDistData, setServiceDistData] = useState<any[]>([]);
  const [projectStatsData, setProjectStatsData] = useState<any[]>([]);
  const [ratingsData, setRatingsData] = useState<any[]>([]);

  // --- DATA STATE (Full Lists for PDF) ---
  const [allServices, setAllServices] = useState<any[]>([]);
  const [allPartners, setAllPartners] = useState<any[]>([]);
  const [allClients, setAllClients] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [allTestimonials, setAllTestimonials] = useState<any[]>([]);
  const [allPricing, setAllPricing] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch ALL data endpoints required for the report
        const [servicesRes, partnersRes, clientsRes, projectsRes, testimonialsRes, pricingRes] = await Promise.allSettled([
          fetch(`${apiBaseUrl}/admin/services`),
          fetch(`${apiBaseUrl}/admin/partner_companies`),
          fetch(`${apiBaseUrl}/customer_query`),
          fetch(`${apiBaseUrl}/admin/projects`),
          fetch(`${apiBaseUrl}/get_testimonials`),
          fetch(`${apiBaseUrl}/admin/pricing`), 
        ]);

        const newCounts = { ...counts };

        // 1. SERVICES
        if (servicesRes.status === "fulfilled" && servicesRes.value.ok) {
          const data = await servicesRes.value.json();
          const safeData = Array.isArray(data) ? data : [];
          newCounts.services = safeData.length;
          setAllServices(safeData); 
        }

        // 2. PARTNERS
        if (partnersRes.status === "fulfilled" && partnersRes.value.ok) {
          const data = await partnersRes.value.json();
          const safeData = Array.isArray(data) ? data : [];
          newCounts.partners = safeData.length;
          setAllPartners(safeData);
        }

        // 3. CLIENTS (QUERIES)
        if (clientsRes.status === "fulfilled" && clientsRes.value.ok) {
          const data = await clientsRes.value.json();
          const safeData = Array.isArray(data) ? data : [];
          newCounts.clients = safeData.length;
          setAllClients(safeData);

          // Calculate Revenue
          const totalRev = safeData.reduce((acc: number, curr: any) => acc + (parseFloat(curr.service_price) || 0), 0);
          newCounts.revenue = totalRev;

          // Chart: Service Distribution
          const serviceCount: Record<string, number> = {};
          safeData.forEach((item: any) => {
            const type = item.service_type || "Other";
            serviceCount[type] = (serviceCount[type] || 0) + 1;
          });
          setServiceDistData(Object.keys(serviceCount).map(key => ({ name: key, value: serviceCount[key] })));

          // Chart: Lead Growth
          const monthCounts: Record<string, number> = {};
          safeData.forEach((item: any) => {
            const date = item.created_at ? new Date(item.created_at) : new Date();
            const month = date.toLocaleString('default', { month: 'short' });
            monthCounts[month] = (monthCounts[month] || 0) + 1;
          });
          const chartData = Object.keys(monthCounts).map(m => ({ name: m, value: monthCounts[m] }));
          setLeadChartData(chartData.length > 0 ? chartData : [{name: 'Jan', value: 0}, {name: 'Feb', value: 0}]);
        }

        // 4. PROJECTS
        if (projectsRes.status === "fulfilled" && projectsRes.value.ok) {
          const data = await projectsRes.value.json();
          const safeData = Array.isArray(data) ? data : [];
          newCounts.projects = safeData.length;
          setAllProjects(safeData);

          const statusCounts = { Completed: 0, Ongoing: 0 };
          safeData.forEach((p: any) => {
            if(p.status === "Completed") statusCounts.Completed++;
            else statusCounts.Ongoing++;
          });
          setProjectStatsData([
            { name: "Completed", value: statusCounts.Completed },
            { name: "Ongoing", value: statusCounts.Ongoing },
          ]);
        }

        // 5. TESTIMONIALS
        if (testimonialsRes.status === "fulfilled" && testimonialsRes.value.ok) {
          const data = await testimonialsRes.value.json();
          const safeData = Array.isArray(data) ? data : [];
          setAllTestimonials(safeData);

          const totalRating = safeData.reduce((acc: number, t: any) => acc + (t.rating || 0), 0);
          newCounts.avgRating = safeData.length > 0 ? Number((totalRating / safeData.length).toFixed(1)) : 0;
          const stars = [0,0,0,0,0];
          safeData.forEach((t: any) => { if(t.rating >= 1 && t.rating <= 5) stars[t.rating - 1]++; });
          setRatingsData(stars.map((count, i) => ({ name: `${i+1}★`, count })));
        }

        // 6. PRICING
        if (pricingRes.status === "fulfilled" && pricingRes.value.ok) {
          const data = await pricingRes.value.json();
          setAllPricing(Array.isArray(data) ? data : []);
        }

        setCounts(newCounts);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // --- PDF GENERATION FUNCTION ---
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // -- HEADER --
    doc.setFillColor(17, 24, 39); // Dark background
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Naiyo24 Business Report", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(156, 163, 175);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // -- EXECUTIVE SUMMARY --
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("1. Executive Summary", 14, 50);
    
    autoTable(doc, {
      startY: 55,
      head: [['Metric', 'Value']],
      body: [
        ['Total Revenue Potential', `Rs. ${counts.revenue.toLocaleString()}`],
        ['Active Partners', counts.partners],
        ['Total Clients (Queries)', counts.clients],
        ['Projects (Completed/Ongoing)', counts.projects],
        ['Active Services', counts.services],
        ['Average User Rating', `${counts.avgRating} / 5`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [31, 41, 55] },
      margin: { left: 14, right: 14 }
    });

    // -- 2. SERVICES --
    let finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("2. Services Offered", 14, finalY);
    
    autoTable(doc, {
      startY: finalY + 5,
      head: [['Category', 'Service Name', 'Charge', 'Description']],
      body: allServices.map(s => [
        s.main_service || "-", 
        s.sub_service || "-", 
        s.service_charge ? `Rs. ${s.service_charge}` : "Custom", 
        s.short_desc || "-"
      ]),
      headStyles: { fillColor: [59, 130, 246] }, // Blue
      styles: { fontSize: 8 },
    });

    // -- 3. PRICING PLANS --
    finalY = (doc as any).lastAutoTable.finalY + 15;
    // Simple check to avoid printing title at bottom of page
    if(finalY > 270) { doc.addPage(); finalY = 20; } 
    
    doc.setFontSize(14);
    doc.text("3. Pricing Packages", 14, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Service Category', 'Basic Plan', 'Standard Plan', 'Premium Plan']],
      body: allPricing.map(p => [
        p.main_service,
        `${p.service_pack_1?.name || '-'} \n(Rs. ${p.service_pack_1?.price || '0'})`,
        `${p.service_pack_2?.name || '-'} \n(Rs. ${p.service_pack_2?.price || '0'})`,
        `${p.service_pack_3?.name || '-'} \n(Rs. ${p.service_pack_3?.price || '0'})`,
      ]),
      headStyles: { fillColor: [234, 179, 8], textColor: 50 }, // Yellow/Dark Text
      styles: { fontSize: 8, cellPadding: 3 },
    });

    // -- 4. PARTNERS --
    finalY = (doc as any).lastAutoTable.finalY + 15;
    if(finalY > 270) { doc.addPage(); finalY = 20; }
    
    doc.setFontSize(14);
    doc.text("4. Registered Partners", 14, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Company', 'Website', 'Description']],
      body: allPartners.map(p => [
        p.name || "-", 
        p.website || "-", 
        p.short_desc || "-"
      ]),
      headStyles: { fillColor: [168, 85, 247] }, // Purple
      styles: { fontSize: 8 }
    });

    // -- 5. PROJECTS --
    finalY = (doc as any).lastAutoTable.finalY + 15;
    if(finalY > 270) { doc.addPage(); finalY = 20; }

    doc.setFontSize(14);
    doc.text("5. Project Portfolio", 14, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Project Title', 'Category', 'Status', 'Technologies']],
      body: allProjects.map(p => [
        p.title || "-", 
        p.category || "-", 
        p.status || "-", 
        p.technologies || "-"
      ]),
      headStyles: { fillColor: [16, 185, 129] }, // Green
      styles: { fontSize: 8 }
    });

    // -- 6. CLIENT QUERIES --
    finalY = (doc as any).lastAutoTable.finalY + 15;
    if(finalY > 270) { doc.addPage(); finalY = 20; }

    doc.setFontSize(14);
    doc.text("6. Recent Client Queries", 14, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Client', 'Email/Phone', 'Service Interested', 'Budget', 'Message']],
      body: allClients.map(c => [
        c.customer_name || "Guest", 
        `${c.cust_email || '-'}\n${c.cust_phone || '-'}`, 
        c.service_type || "-", 
        c.service_price ? `Rs. ${c.service_price}` : "-",
        c.message ? c.message.substring(0, 50) + "..." : "-"
      ]),
      headStyles: { fillColor: [31, 41, 55] }, // Dark Gray
      styles: { fontSize: 7, overflow: 'linebreak' },
      columnStyles: { 4: { cellWidth: 50 } } // Limit message width
    });

    // -- 7. TESTIMONIALS --
    finalY = (doc as any).lastAutoTable.finalY + 15;
    if(finalY > 270) { doc.addPage(); finalY = 20; }

    doc.setFontSize(14);
    doc.text("7. Testimonials & Reviews", 14, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Client Name', 'Company', 'Rating', 'Review']],
      body: allTestimonials.map(t => [
        t.name || "-", 
        t.company || "-", 
        `${t.rating} / 5`, 
        t.content || "-"
      ]),
      headStyles: { fillColor: [249, 115, 22] }, // Orange
      styles: { fontSize: 8 }
    });

    // Save File
    doc.save("Naiyo24_Full_Business_Report.pdf");
  };

  const stats = [
    { title: "Potential Revenue", value: `₹${counts.revenue.toLocaleString()}`, change: "+12.5%", icon: <DollarSign size={24} />, color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)", border: "rgba(34, 197, 94, 0.2)" },
    { title: "Active Partners", value: counts.partners.toLocaleString(), change: "+3 New", icon: <Briefcase size={24} />, color: "#a855f7", bg: "rgba(168, 85, 247, 0.1)", border: "rgba(168, 85, 247, 0.2)" },
    { title: "Total Clients", value: counts.clients.toLocaleString(), change: "+8.2%", icon: <Users size={24} />, color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.2)" },
    { title: "Avg Rating", value: counts.avgRating, change: "4.8/5", icon: <Star size={24} />, color: "#eab308", bg: "rgba(234, 179, 8, 0.1)", border: "rgba(234, 179, 8, 0.2)" },
  ];

  return (
    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}>

      <style>{`
        /* --- GLOBAL DASHBOARD STYLES --- */
        .dashboard-container { 
          font-family: 'Poppins', 'Segoe UI', sans-serif; 
          color: #f3f4f6; 
          min-height: 100vh;
          width: 100%;
          background-color: #111827; 
          padding: 24px 32px 60px 32px;
          box-sizing: border-box;
        }

        /* --- HEADER --- */
        .top-header { 
          display: flex; justify-content: space-between; align-items: flex-start; 
          margin-bottom: 40px; 
          padding-bottom: 24px; border-bottom: 1px solid #374151; 
          flex-wrap: wrap; gap: 20px;
        }
        .welcome-text h1 { 
          font-size: 32px; font-weight: 700; 
          background: linear-gradient(90deg, #ffffff, #9ca3af);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0; 
        }
        .welcome-text p { color: #9ca3af; font-size: 15px; margin-top: 6px; }
        
        .header-actions { display: flex; gap: 12px; align-items: center; }

        .search-wrapper {
          position: relative;
          display: flex; align-items: center;
          background: #1f2937; border: 1px solid #374151;
          border-radius: 10px;
          transition: width 0.3s ease;
          height: 44px;
        }
        .search-input {
          background: transparent; border: none; outline: none;
          color: white; font-size: 14px;
          padding: 0 12px; width: 100%; height: 100%;
        }
        .icon-btn { 
          background: #1f2937; border: 1px solid #374151; color: #9ca3af; 
          width: 44px; height: 44px;
          border-radius: 10px; cursor: pointer; 
          display: flex; align-items: center; justify-content: center; 
          transition: all 0.2s ease;
        }
        .icon-btn:hover { background: #374151; color: white; border-color: #4b5563; }
        .search-toggle-btn { background: transparent; border: none; color: #9ca3af; cursor: pointer; padding: 0 12px; height: 100%; display: flex; align-items: center; }
        .search-toggle-btn:hover { color: white; }

        /* --- STATS GRID --- */
        .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
          gap: 24px; 
          margin-bottom: 48px; 
        }
        .dashboard-card {
          background: #1f2937; 
          border: 1px solid #374151; 
          border-radius: 16px; 
          padding: 20px 24px; 
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          height: 100%;
          display: flex; flex-direction: column; justify-content: space-between;
        }
        .dashboard-card:hover { 
          transform: translateY(-4px); 
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3); 
          border-color: #4b5563;
        }
        .stat-card-inner { display: flex; justify-content: space-between; align-items: flex-start; width: 100%; }
        .stat-info .title { font-size: 14px; color: #9ca3af; font-weight: 500; margin-bottom: 8px; }
        .stat-info .value { font-size: 28px; font-weight: 700; color: white; margin: 0; line-height: 1.2; }
        .stat-info .change { font-size: 13px; font-weight: 600; color: #10b981; display: flex; align-items: center; gap: 4px; margin-top: 10px; }
        .stat-icon { padding: 12px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }

        /* --- CHARTS LAYOUT --- */
        .chart-row {
          display: grid;
          gap: 24px;
          margin-bottom: 48px; 
          align-items: stretch;
        }
        
        .main-charts { 
          grid-template-columns: 2fr 1fr; 
        }

        .secondary-charts { 
          grid-template-columns: repeat(3, 1fr); 
        }

        /* Generic Chart Wrapper */
        .chart-card {
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 16px;
          padding: 20px;
          height: 100%; 
          min-height: 400px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          overflow: hidden;
          position: relative;
        }

        /* --- QUICK STAT CARD --- */
        .quick-stat-card {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          border: 1px solid #374151;
          border-radius: 16px;
          display: flex; flex-direction: column; 
          justify-content: center; align-items: center;
          height: 100%; 
          min-height: 400px; 
          position: relative; overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          text-align: center;
        }
        .quick-stat-card::after {
          content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }
        
        .quick-icon {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
          z-index: 1;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
        }
        .quick-value { font-size: 42px; font-weight: 800; color: white; margin: 0; z-index: 1; line-height: 1; }
        .quick-label { color: #9ca3af; font-size: 14px; margin-top: 8px; font-weight: 500; z-index: 1; }
        .quick-trend { 
          margin-top: 20px; padding: 6px 14px; border-radius: 20px; 
          background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2);
          font-size: 12px; font-weight: 700; display: flex; gap: 6px; align-items: center; z-index: 1; 
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 1200px) {
          .main-charts { grid-template-columns: 1fr; }
          .secondary-charts { grid-template-columns: 1fr 1fr; }
          .quick-stat-card { grid-column: span 1; } 
        }
        @media (max-width: 800px) {
          .secondary-charts { grid-template-columns: 1fr; }
          .quick-stat-card { grid-column: span 1; }
          .top-header { flex-direction: column; align-items: stretch; }
          .header-actions { justify-content: flex-end; margin-top: 16px; }
        }
      `}</style>

      <div className="dashboard-container">
        <header className="top-header">
          <div className="welcome-text">
            <h1>Admin Dashboard</h1>
            <p>Overview of Naiyo24 business performance & analytics</p>
          </div>
          
          <div className="header-actions">
            <div className="search-wrapper" style={{ width: searchOpen ? '250px' : '44px', paddingLeft: searchOpen ? '0' : '0' }}>
               {searchOpen && (
                 <input 
                   type="text" 
                   className="search-input" 
                   placeholder="Search..." 
                   autoFocus
                 />
               )}
               <button className="search-toggle-btn" onClick={() => setSearchOpen(!searchOpen)} style={{ width: '44px', justifyContent: 'center' }}>
                 {searchOpen ? <X size={20} /> : <Search size={20} />}
               </button>
            </div>

            {/* --- PDF DOWNLOAD BUTTON --- */}
            <button 
              className="icon-btn" 
              onClick={handleDownloadPDF} 
              title="Download Full Report (PDF)"
              style={{ color: '#ef4444', borderColor: '#ef4444' }} 
            >
               <FileText size={20} />
            </button>

            <button className="icon-btn">
               <Calendar size={20} />
            </button>
          </div>
        </header>

        {/* 1. STATS GRID */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="dashboard-card">
              <div className="stat-card-inner">
                <div className="stat-info">
                  <div className="title">{stat.title}</div>
                  <div className="value">{stat.value}</div>
                  <div className="change">
                    <TrendingUp size={16} /> {stat.change}
                  </div>
                </div>
                <div 
                  className="stat-icon" 
                  style={{ backgroundColor: stat.bg, border: `1px solid ${stat.border}`, color: stat.color }}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2. MAIN CHARTS (Row 1) */}
        <div className="chart-row main-charts">
          <div className="chart-card">
             <LeadGrowthChart data={leadChartData} />
          </div>
          <div className="chart-card">
             <ServiceDistributionChart data={serviceDistData} />
          </div>
        </div>

        {/* 3. SECONDARY CHARTS (Row 2) */}
        <div className="chart-row secondary-charts">
          <div className="chart-card">
             <ProjectStatsChart data={projectStatsData} />
          </div>
          
          <div className="chart-card">
             <RatingsChart data={ratingsData} />
          </div>
          
          <div className="quick-stat-card">
             <div className="quick-icon">
               <Layers size={36} color="#60a5fa" strokeWidth={2} />
             </div>
             <h3 className="quick-value">{counts.services}</h3>
             <span className="quick-label">Active Services Offered</span>
             <div className="quick-trend">
                <ArrowUpRight size={16} /> Steady Growth
             </div>
          </div>
        </div>

      </div>
    </Sidebar>
  );
}