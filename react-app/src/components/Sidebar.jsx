import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const LogoIcon = () => (
    <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="sbg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#b91c1c" }} />
                <stop offset="100%" style={{ stopColor: "#ef4444" }} />
            </linearGradient>
        </defs>
        <rect width="100" height="100" rx="22" fill="url(#sbg)" />
        <rect x="18" y="24" width="50" height="58" rx="5" fill="white" opacity="0.95" />
        <rect x="26" y="42" width="30" height="3" rx="1.5" fill="#fca5a5" />
        <rect x="26" y="50" width="24" height="3" rx="1.5" fill="#fca5a5" />
        <rect x="26" y="58" width="20" height="3" rx="1.5" fill="#fecdd3" />
        <g transform="rotate(-35, 70, 40)">
            <rect x="60" y="18" width="9" height="34" rx="3" fill="white" />
            <rect x="62" y="15" width="2.5" height="28" rx="1" fill="#fca5a5" />
            <polygon points="60,52 69,52 64.5,62" fill="#ef4444" />
            <rect x="60" y="14" width="9" height="5" rx="2" fill="#dc2626" />
        </g>
    </svg>
);

/* SVG icons — always render in currentColor (red in active, grey otherwise) */
const IconHome = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const IconEdit = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const IconPen = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
);

const IconUser = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const IconSettings = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
);

const NAV_ITEMS = [
    { to: "/home", icon: <IconHome />, label: "Home" },
    { to: "/my-posts", icon: <IconEdit />, label: "My Posts" },
    { to: "/create", icon: <IconPen />, label: "Create Post" },
    { to: "/profile", icon: <IconUser />, label: "Profile" },
    { to: "/settings", icon: <IconSettings />, label: "Settings" },
];

function Sidebar({ user }) {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <LogoIcon />
                <span className="sidebar-brand">BlogSphere</span>
            </div>

            <nav className="sidebar-nav">
                {NAV_ITEMS.map(item => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`sidebar-item ${isActive(item.to) ? "active" : ""}`}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-text">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}

export default Sidebar;
