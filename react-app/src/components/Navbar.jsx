import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/home" className="brand-link">BlogPlatform</Link>
            </div>
            <div className="navbar-links">
                <Link to="/home" className="nav-item">Home</Link>
                {user ? (
                    <>
                        <Link to="/create" className="nav-item">Create Post</Link>
                        <span className="nav-user">Hello, {user.username}</span>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </>
                ) : (
                    <Link to="/login" className="nav-item login-btn">Login</Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
