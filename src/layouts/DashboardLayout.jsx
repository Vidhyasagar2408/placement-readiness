import { NavLink, Outlet } from "react-router-dom";
import { BookOpen, ChartColumn, Code2, LayoutDashboard, UserRound } from "lucide-react";

const navItems = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/practice", label: "Practice", icon: Code2 },
  { to: "/app/assessments", label: "Assessments", icon: ChartColumn },
  { to: "/app/resources", label: "Resources", icon: BookOpen },
  { to: "/app/profile", label: "Profile", icon: UserRound },
];

function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <h2 className="sidebar-title">Placement Readiness</h2>
        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>Placement Prep</h1>
          <div className="avatar-placeholder">U</div>
        </header>
        <main className="outlet-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
