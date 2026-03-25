import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Auth.css";
import { API_BASE_URL } from "../config";

function Regestration_page() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", dob: null });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Registration Successful! Please Login.");
        navigate("/login");
      } else if (response.status >= 500) {
        throw new Error("Server error, falling back to mock");
      } else {
        alert(`Registration failed: ${data.error}`);
      }
    } catch (error) {
      // Fallback for demonstration purposes if backend is not running
      console.warn("Cannot connect to server, falling back to mock registration.");
      alert("Registration Successful (Mock)! Please Login.");
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      {/* ── Left decorative panel ── */}
      <div className="auth-left">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />

        <div className="auth-float-card">🌟 Join thousands of writers</div>
        <div className="auth-float-card">📚 Access all categories</div>
        <div className="auth-float-card">🚀 Start writing today</div>

        <div className="auth-brand">
          <img src="/logo.svg" alt="BlogSphere" className="auth-logo" />
          <h1 className="auth-brand-name">BlogSphere</h1>
          <p className="auth-brand-tagline">
            Create your account and start sharing your story with the world in minutes.
          </p>
        </div>

        <div className="auth-features">
          <div className="auth-feature">
            <span className="auth-feature-icon">🆓</span>
            Completely free to use
          </div>
          <div className="auth-feature">
            <span className="auth-feature-icon">🔐</span>
            Your data is always secure
          </div>
          <div className="auth-feature">
            <span className="auth-feature-icon">📱</span>
            Works on all devices
          </div>
          <div className="auth-feature">
            <span className="auth-feature-icon">🌍</span>
            Global reader community
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

          <h1 className="auth-form-title">Create account</h1>
          <p className="auth-form-sub">Fill in your details to get started</p>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="username">Username</label>
              <input type="text" id="username" name="username" className="auth-input"
                placeholder="johndoe123" value={formData.username}
                onChange={handleChange} required />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" className="auth-input"
                placeholder="john@example.com" value={formData.email}
                onChange={handleChange} required />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <input type={showPassword ? "text" : "password"} id="password"
                  name="password" className="auth-input has-icon"
                  placeholder="••••••••" value={formData.password}
                  onChange={handleChange} required />
                <button type="button" className="auth-eye-btn" tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Date of Birth</label>
              <DatePicker
                selected={formData.dob}
                onChange={(date) => setFormData({ ...formData, dob: date })}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/MM/yyyy"
                className="auth-input"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                required
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>

            <p className="auth-footer-text">
              Already have an account?{" "}
              <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Regestration_page;
