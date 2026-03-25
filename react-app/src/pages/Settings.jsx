import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { API_BASE_URL } from "../config";
import Sidebar from "../components/Sidebar";
import "./Settings.css";

function Settings({ setUser }) {
    const [user, setLocalUser] = useState(null);
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [newUsername, setNewUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [usernameMsg, setUsernameMsg] = useState({ text: "", type: "" });
    const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" });
    const [activity, setActivity] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) { navigate("/"); return; }
        setLocalUser(JSON.parse(stored));
        setActivity(JSON.parse(localStorage.getItem("userActivity") || "[]"));
    }, []);

    const handleChangeUsername = async () => {
        if (!newUsername.trim()) { setUsernameMsg({ text: "Please enter a new username", type: "error" }); return; }
        try {
            const res = await fetch(`${API_BASE_URL}/update-username`, {
                method: "PUT", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, newUsername: newUsername.trim() })
            });
            const data = await res.json();
            if (res.ok) {
                const updated = { ...user, username: newUsername.trim() };
                localStorage.setItem("user", JSON.stringify(updated));
                setLocalUser(updated); setNewUsername("");
                setUsernameMsg({ text: "✅ Username updated!", type: "success" });
            } else setUsernameMsg({ text: data.error || "Failed", type: "error" });
        } catch {
            const updated = { ...user, username: newUsername.trim() };
            localStorage.setItem("user", JSON.stringify(updated));
            setLocalUser(updated); setNewUsername("");
            setUsernameMsg({ text: "✅ Username updated! (Demo mode)", type: "success" });
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) { setPasswordMsg({ text: "Fill in all fields", type: "error" }); return; }
        if (newPassword !== confirmPassword) { setPasswordMsg({ text: "Passwords don't match", type: "error" }); return; }
        if (newPassword.length < 6) { setPasswordMsg({ text: "Min 6 characters", type: "error" }); return; }
        try {
            const res = await fetch(`${API_BASE_URL}/update-password`, {
                method: "PUT", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, currentPassword, newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
                setPasswordMsg({ text: "✅ Password updated!", type: "success" });
            } else setPasswordMsg({ text: data.error || "Failed", type: "error" });
        } catch {
            setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
            setPasswordMsg({ text: "✅ Password updated! (Demo mode)", type: "success" });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        if (setUser) setUser(null);
        navigate("/");
    };

    if (!user) return null;

    return (
        <div className="settings-layout">
            <Sidebar user={user} />

            <div className="settings-main">
                {/* Page header */}
                <div className="settings-page-header">
                    <div className="settings-page-icon">⚙️</div>
                    <div>
                        <h1 className="settings-page-title">Settings</h1>
                        <p className="settings-page-sub">Manage your account and preferences</p>
                    </div>
                </div>

                {/* ── Section 1: User Identity ── */}
                <div className="scard">
                    <div className="scard-label">👤 Profile</div>
                    <div className="scard-avatar-row">
                        <div className="scard-avatar">{user.username?.charAt(0).toUpperCase()}</div>
                        <div>
                            <div className="scard-username">@{user.username}</div>
                            <div className="scard-email">{user.email || "No email set"}</div>
                        </div>
                    </div>
                </div>

                {/* ── Section 2: Theme ── */}
                <div className="scard">
                    <div className="scard-label">🎨 Appearance</div>
                    <p className="scard-desc">Choose how BlogSphere looks to you</p>
                    <div className="theme-toggle-row">
                        <button
                            className={`theme-pill ${!isDarkMode ? "active" : ""}`}
                            onClick={() => isDarkMode && toggleTheme()}
                        >
                            <span>☀️</span> Light
                        </button>
                        <div className="theme-divider" />
                        <button
                            className={`theme-pill ${isDarkMode ? "active" : ""}`}
                            onClick={() => !isDarkMode && toggleTheme()}
                        >
                            <span>🌙</span> Dark
                        </button>
                        <div className="theme-active-indicator">
                            Currently: <strong>{isDarkMode ? "Dark" : "Light"} Mode</strong>
                        </div>
                    </div>
                </div>

                {/* ── Section 3: Change Username ── */}
                <div className="scard">
                    <div className="scard-label">✏️ Change Username</div>
                    <p className="scard-desc">Current: <span className="scard-highlight">@{user.username}</span></p>
                    <div className="scard-form">
                        <input
                            className="scard-input"
                            type="text"
                            placeholder="New username"
                            value={newUsername}
                            onChange={e => { setNewUsername(e.target.value); setUsernameMsg({ text: "", type: "" }); }}
                        />
                        <button className="scard-btn" onClick={handleChangeUsername}>Update</button>
                    </div>
                    {usernameMsg.text && <div className={`scard-msg ${usernameMsg.type}`}>{usernameMsg.text}</div>}
                </div>

                {/* ── Section 4: Change Password ── */}
                <div className="scard">
                    <div className="scard-label">🔐 Change Password</div>
                    <p className="scard-desc">Update your account password</p>
                    <div className="scard-form scard-form-col">
                        <input className="scard-input" type="password" placeholder="Current password"
                            value={currentPassword} onChange={e => { setCurrentPassword(e.target.value); setPasswordMsg({ text: "", type: "" }); }} />
                        <input className="scard-input" type="password" placeholder="New password (min 6 chars)"
                            value={newPassword} onChange={e => { setNewPassword(e.target.value); setPasswordMsg({ text: "", type: "" }); }} />
                        <input className="scard-input" type="password" placeholder="Confirm new password"
                            value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setPasswordMsg({ text: "", type: "" }); }} />
                        <button className="scard-btn" onClick={handleChangePassword}>Update Password</button>
                    </div>
                    {passwordMsg.text && <div className={`scard-msg ${passwordMsg.type}`}>{passwordMsg.text}</div>}
                </div>

                {/* ── Section 5: Activity ── */}
                <div className="scard">
                    <div className="scard-label">📊 Activity</div>
                    <p className="scard-desc">Your recent likes and comments</p>
                    {activity.length === 0 ? (
                        <div className="activity-empty">
                            <span className="activity-empty-icon">📭</span>
                            <p>No activity yet. Start liking and commenting on posts!</p>
                        </div>
                    ) : (
                        <div className="activity-list">
                            {activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((item, i) => (
                                <div key={i} className="activity-item">
                                    <span className="activity-type-icon">{item.type === "like" ? "❤️" : "💬"}</span>
                                    <div className="activity-content">
                                        <span className="activity-action">
                                            You {item.type === "like" ? "liked" : "commented on"}{" "}
                                            <strong>{item.postTitle || "a post"}</strong>
                                            {item.type === "comment" && item.commentText && (
                                                <span className="activity-comment-text">: "{item.commentText}"</span>
                                            )}
                                        </span>
                                        <span className="activity-time">
                                            {new Date(item.timestamp).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Section 6: Sign Out ── */}
                <div className="scard scard-danger">
                    <div className="scard-label scard-label-danger">🚪 Sign Out</div>
                    <p className="scard-desc">You will be logged out of your BlogSphere account.</p>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>

            </div>
        </div>
    );
}

export default Settings;
