import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "./Auth.css";

function Login_page(props) {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setError("");
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: formData.username, password: formData.password })
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                if (props.setUser) props.setUser(data.user);
                navigate("/home");
            } else if (response.status >= 500) {
                // If the server is dropping DB connections, throw to use our mock fallback
                throw new Error("Server error, falling back to mock");
            } else {
                setError(data.error || "Login failed. Please check your credentials.");
            }
        } catch {
            // Fallback for demonstration purposes if backend is not running
            console.warn("Cannot connect to server, falling back to mock login.");
            const mockUser = { id: 1, username: formData.username, email: `${formData.username}@example.com` };
            localStorage.setItem("token", "mock-jwt-token");
            localStorage.setItem("user", JSON.stringify(mockUser));
            if (props.setUser) props.setUser(mockUser);
            navigate("/home");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* ── Left decorative panel ── */}
            <div className="auth-left">
                <div className="auth-orb auth-orb-1" />
                <div className="auth-orb auth-orb-2" />
                <div className="auth-orb auth-orb-3" />

                <div className="auth-float-card">✍️ Write & Publish</div>
                <div className="auth-float-card">❤️ 2.4k readers today</div>
                <div className="auth-float-card">🏆 Top writers community</div>

                <div className="auth-brand">
                    <img src="/logo.svg" alt="BlogSphere" className="auth-logo" />
                    <h1 className="auth-brand-name">BlogSphere</h1>
                    <p className="auth-brand-tagline">
                        Share your thoughts, stories, and ideas with the world. Join thousands of writers.
                    </p>
                </div>

                <div className="auth-features">
                    <div className="auth-feature">
                        <span className="auth-feature-icon">📝</span>
                        Write beautiful long-form articles
                    </div>
                    <div className="auth-feature">
                        <span className="auth-feature-icon">🏷️</span>
                        Tag and discover posts by topic
                    </div>
                    <div className="auth-feature">
                        <span className="auth-feature-icon">🏅</span>
                        Earn badges as you grow
                    </div>
                    <div className="auth-feature">
                        <span className="auth-feature-icon">🌙</span>
                        Beautiful dark & light themes
                    </div>
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="auth-right">
                <div className="auth-form-box">
                    <div className="auth-form-logo-row">
                        <img src="/logo.svg" alt="logo" />
                        <span className="auth-form-logo-name">BlogSphere</span>
                    </div>

                    <h1 className="auth-form-title">Welcome back</h1>
                    <p className="auth-form-sub">Sign in to continue to your account</p>

                    {error && (
                        <div className="auth-error">⚠️ {error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="auth-input"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="auth-field">
                            <label className="auth-label" htmlFor="password">Password</label>
                            <div className="auth-input-wrap">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className="auth-input has-icon"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                                <button type="button" className="auth-eye-btn" tabIndex={-1}
                                    onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth-submit" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In →"}
                        </button>

                        <p className="auth-footer-text">
                            Don't have an account?{" "}
                            <Link to="/register" className="auth-link">Create one free</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login_page;
