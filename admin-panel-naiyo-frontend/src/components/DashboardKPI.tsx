import { Mail, DollarSign, Users, Activity } from "lucide-react";

const KPIS = [
  { label: "Emails Sent", value: "12,361", change: "+14%", icon: <Mail /> },
  { label: "Sales Obtained", value: "431,225", change: "+21%", icon: <DollarSign /> },
  { label: "New Clients", value: "32,441", change: "+5%", icon: <Users /> },
  { label: "Traffic Received", value: "1,325,134", change: "+43%", icon: <Activity /> },
];

export default function DashboardKPI() {
  return (
    <>
      <style>{`
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
          position: relative;
  cursor: pointer;
        }

        .kpi-tooltip {
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: #111827;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  opacity: 0;
  pointer-events: none;
  transition: 0.2s;
  white-space: nowrap;
}

.kpi-card:hover .kpi-tooltip {
  opacity: 1;
}

        .kpi-card {
          background: #1f2937;
          padding: 20px;
          border-radius: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          box-shadow: 0 10px 25px rgba(0,0,0,0.25);
        }

        .kpi-left {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .kpi-value {
          font-size: 22px;
          font-weight: 600;
        }

        .kpi-label {
          font-size: 13px;
          color: #9ca3af;
        }

        .kpi-change {
          font-size: 12px;
          color: #22c55e;
        }

        .kpi-ring {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 4px solid #22c55e;
          border-top-color: transparent;
        }
      `}</style>

      <div className="kpi-grid">
        {KPIS.map((k, i) => (
          <div className="kpi-card" key={i}>
            <div className="kpi-left">
              {k.icon}
              <div>
                <div className="kpi-value">{k.value}</div>
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-change">{k.change}</div>
              </div>
            </div>
            <div className="kpi-ring" />
          </div>
        ))}
      </div>
    </>
  );
}
