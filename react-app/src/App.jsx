import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Registration_page from "./pages/Regestration_page";
import Login_page from "./pages/Login_page";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import MyPosts from "./pages/MyPosts";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <ThemeToggle />
          <Routes>
            <Route path="/" element={user ? <Navigate to="/home" /> : <Login_page setUser={setUser} />} />
            <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
            <Route path="/login" element={user ? <Navigate to="/home" /> : <Login_page setUser={setUser} />} />
            <Route path="/register" element={<Registration_page />} />
            <Route
              path="/create"
              element={user ? <CreatePost user={user} /> : <Navigate to="/" />}
            />
            <Route path="/post/:id" element={user ? <PostDetails /> : <Navigate to="/" />} />
            <Route path="/my-posts" element={user ? <MyPosts /> : <Navigate to="/" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
            <Route path="/settings" element={user ? <Settings setUser={setUser} /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
