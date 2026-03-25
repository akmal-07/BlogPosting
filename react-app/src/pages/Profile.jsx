import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { API_BASE_URL } from "../config";
import "./Profile.css";

const BadgeIcon = ({ fill = "#ffd700", ribbonFill = "#fca5a5", size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 32 36" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <polygon points="10,0 18,0 16,13 8,13" fill={ribbonFill} />
        <polygon points="14,0 22,0 24,13 16,13" fill={ribbonFill} opacity="0.7" />
        <circle cx="16" cy="24" r="11" fill={fill} />
        <circle cx="16" cy="24" r="11" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
        <circle cx="16" cy="24" r="8.5" fill="none" stroke="white" strokeWidth="1" opacity="0.35" />
        <polygon points="16,16.5 17.5,21.5 22.8,21.5 18.6,24.8 20.1,29.8 16,26.5 11.9,29.8 13.4,24.8 9.2,21.5 14.5,21.5"
            fill="white" opacity="0.85" />
    </svg>
);

function Profile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ displayName: "", bio: "", location: "", website: "" });
    const [showShareToast, setShowShareToast] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const dpInputRef = useRef(null);
    const navigate = useNavigate();

    const [stats, setStats] = useState({ posts: 0 });

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) { navigate("/"); return; }
        const u = JSON.parse(stored);
        setUser(u);
        const savedPic = localStorage.getItem(`profilePic_${u.username}`);
        if (savedPic) setProfilePic(savedPic);
        const extras = JSON.parse(localStorage.getItem(`profileExtras_${u.username}`) || "{}");
        setForm({
            displayName: extras.displayName || u.username || "",
            bio: extras.bio || "✍️ Blogger & creative thinker. Writing about tech, life, and everything in between.",
            location: extras.location || "India",
            website: extras.website || "https://blogsphere.com"
        });

        // Fetch real post count from backend
        fetch(`${API_BASE_URL}/user/posts/${u.username}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setStats({ posts: data.length });
                }
            })
            .catch(err => {
                // Fallback to mock DB if backend fails
                const mockDb = JSON.parse(localStorage.getItem("mock_all_posts") || "[]");
                const userPostsCount = mockDb.filter(p => p.author === u.username).length;
                setStats({ posts: userPostsCount });
            });

    }, []);

    const handleSave = () => {
        if (!user) return;
        localStorage.setItem(`profileExtras_${user.username}`, JSON.stringify(form));
        setIsEditing(false);
    };

    const handleShareProfile = async () => {
        const profileUrl = window.location.origin + "/profile";
        try {
            if (navigator.share) {
                await navigator.share({ title: `${user.username}'s Profile — BlogSphere`, url: profileUrl });
            } else {
                await navigator.clipboard.writeText(profileUrl);
                setShowShareToast(true);
                setTimeout(() => setShowShareToast(false), 2500);
            }
        } catch {
            await navigator.clipboard.writeText(profileUrl);
            setShowShareToast(true);
            setTimeout(() => setShowShareToast(false), 2500);
        }
    };

    const handleDPChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setProfilePic(ev.target.result);
            if (user) localStorage.setItem(`profilePic_${user.username}`, ev.target.result);
        };
        reader.readAsDataURL(file);
    };

    const postCount = stats.posts;

    const BADGE_TIERS = [
        { name: "Bronze", req: 50, color: "#cd7f32", ribbon: "#a0522d", bg: "linear-gradient(135deg, #cd7f32, #e8a85c)" },
        { name: "Silver", req: 100, color: "#c0c0c0", ribbon: "#888", bg: "linear-gradient(135deg, #b0b0b0, #e0e0e0)" },
        { name: "Gold", req: 250, color: "#ffd700", ribbon: "#fca5a5", bg: "linear-gradient(135deg, #daa520, #ffd700)" },
        { name: "Platinum", req: 500, color: "#9bb7d4", ribbon: "#5b9bd5", bg: "linear-gradient(135deg, #8e9aaf, #c8daea)" },
        { name: "Diamond", req: 1000, color: "#4fc3f7", ribbon: "#dc2626", bg: "linear-gradient(135deg, #4fc3f7, #b9f2ff)" },
    ];

    const currentBadge = [...BADGE_TIERS].reverse().find(b => postCount >= b.req) || null;

    if (!user) return <div className="loading">Loading profile...</div>;

    return (
        <div className="profile-layout">
            <Sidebar user={user} />

            <div className="profile-main">

                {/* ── Hero Card ── */}
                <div className="profile-hero">
                    {/* Animated mesh background */}
                    <div className="hero-mesh">
                        <div className="mesh-orb orb1" />
                        <div className="mesh-orb orb2" />
                        <div className="mesh-orb orb3" />
                    </div>

                    {/* Action buttons top-right */}
                    <div className="hero-actions">
                        {isEditing ? (
                            <>
                                <button className="hero-btn cancel-btn" onClick={() => setIsEditing(false)}>✕ Cancel</button>
                                <button className="hero-btn save-btn" onClick={handleSave}>✓ Save</button>
                            </>
                        ) : (
                            <>
                                <button className="hero-btn share-btn" onClick={handleShareProfile}>📤 Share</button>
                                <button className="hero-btn edit-btn" onClick={() => setIsEditing(true)}>✏️ Edit</button>
                            </>
                        )}
                    </div>

                    {/* Avatar centered */}
                    <div className="hero-avatar-wrap" onClick={() => dpInputRef.current.click()} title="Change photo">
                        <div className="hero-avatar-ring">
                            <div className="hero-avatar">
                                {profilePic
                                    ? <img src={profilePic} alt="Profile" className="avatar-img" />
                                    : <span>{user.username?.charAt(0).toUpperCase()}</span>
                                }
                            </div>
                        </div>
                        <div className="hero-avatar-camera">📷</div>
                        <input ref={dpInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleDPChange} />
                    </div>

                    {/* Name + badge */}
                    <div className="hero-name-row">
                        <h1 className="hero-name">{form.displayName || user.username}</h1>
                        {currentBadge && (
                            <span className="name-badge-icon">
                                <BadgeIcon fill={currentBadge.color} ribbonFill={currentBadge.ribbon} size={38} />
                            </span>
                        )}
                    </div>
                    <div className="hero-handle">@{user.username?.toLowerCase()}</div>
                </div>

                {/* ── Content grid ── */}
                <div className="profile-content-grid">

                    {/* Left column */}
                    <div className="profile-left-col">

                        {/* About card */}
                        <div className="pcard">
                            <div className="pcard-title">👤 About</div>
                            {isEditing ? (
                                <div className="profile-edit-form">
                                    <div className="pf-group">
                                        <label className="pf-label">Display Name</label>
                                        <input className="pf-input" value={form.displayName}
                                            onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                                            placeholder="Your name" />
                                    </div>
                                    <div className="pf-group">
                                        <label className="pf-label">Bio</label>
                                        <textarea className="pf-input pf-textarea" rows={3} value={form.bio}
                                            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                            placeholder="Tell the world about yourself" />
                                    </div>
                                    <div className="pf-group">
                                        <label className="pf-label">Location</label>
                                        <input className="pf-input" value={form.location}
                                            onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                            placeholder="Where are you from?" />
                                    </div>
                                    <div className="pf-group">
                                        <label className="pf-label">Website</label>
                                        <input className="pf-input" value={form.website}
                                            onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                                            placeholder="https://yoursite.com" />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="about-bio">{form.bio}</p>
                                    <div className="about-meta">
                                        {form.location && <div className="meta-chip">📍 {form.location}</div>}
                                        {form.website && (
                                            <a href={form.website} className="meta-chip meta-link" target="_blank" rel="noreferrer">
                                                🔗 {form.website.replace(/https?:\/\//, '')}
                                            </a>
                                        )}
                                        <div className="meta-chip">📅 Joined Feb 2026</div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Stats card */}
                        <div className="pcard stats-card">
                            <div className="pcard-title">📊 Stats</div>
                            <div className="stats-grid single-stat">
                                <div className="stat-block posts-stat">
                                    <span className="stat-big">{stats.posts}</span>
                                    <span className="stat-sub">Total Posts Published</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column — Badges */}
                    <div className="profile-right-col">
                        <div className="pcard badges-card">
                            <div className="pcard-title">🏅 Badges</div>
                            {currentBadge ? (
                                <div className="active-badge-banner" style={{ background: currentBadge.bg }}>
                                    <BadgeIcon fill={currentBadge.color} ribbonFill={currentBadge.ribbon} size={52} />
                                    <div className="active-badge-info">
                                        <span className="active-badge-name">{currentBadge.name}</span>
                                        <span className="active-badge-sub">Current Badge</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="badges-hint">Publish 50 posts to earn your first badge!</p>
                            )}

                            <div className="badge-grid">
                                {BADGE_TIERS.map(b => {
                                    const earned = postCount >= b.req;
                                    const progress = Math.min((postCount / b.req) * 100, 100);
                                    return (
                                        <div key={b.name} className={`badge-card ${earned ? "badge-earned" : "badge-locked"}`}>
                                            <div className="badge-card-icon" style={earned ? { background: b.bg + ", #fff" } : {}}>
                                                <BadgeIcon fill={earned ? b.color : "#9ca3af"} ribbonFill={earned ? b.ribbon : "#d1d5db"} size={44} />
                                            </div>
                                            <div className="badge-card-name">{b.name}</div>
                                            <div className="badge-card-req">{b.req} posts</div>
                                            <div className="badge-card-bar">
                                                <div className="badge-card-fill" style={{ width: `${progress}%`, background: b.bg }} />
                                            </div>
                                            {earned && <div className="badge-card-earned">✅</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {showShareToast && (
                <div className="share-toast">✅ Profile link copied to clipboard!</div>
            )}
        </div>
    );
}

export default Profile;
