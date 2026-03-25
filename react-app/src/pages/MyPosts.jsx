import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import Sidebar from "../components/Sidebar";
import "./MyPosts.css";

function MyPosts() {
    const [posts, setPosts] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            const u = JSON.parse(stored);
            setUser(u);
            
            // Fetch from local mock DB and filter for this user
            const mockDb = JSON.parse(localStorage.getItem("mock_all_posts") || "[]");
            setPosts(mockDb.filter(p => p.author === u.username));
            
            // Try actual backend if running
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 2000);
            fetch(`${API_BASE_URL}/user/posts/${u.username}`, { signal: controller.signal })
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error("Server error");
                })
                .then(data => { if (data.length > 0) setPosts(data); })
                .catch(() => {})
                .finally(() => clearTimeout(timeout));
        } else {
            navigate("/");
        }
    }, [navigate]);

    const handleDelete = async (id) => {
        if (window.confirm("Delete this post?")) {
            try {
                // Call backend to delete
                const res = await fetch(`${API_BASE_URL}/post/${id}`, { method: "DELETE" });
                if (res.ok) {
                    setPosts(prev => prev.filter(p => p._id !== id));
                } else {
                    // It might be a mock post, or backend failed. Still remove locally.
                    setPosts(prev => prev.filter(p => p._id !== id));
                    const mockDb = JSON.parse(localStorage.getItem("mock_all_posts") || "[]");
                    const updatedDb = mockDb.filter(p => p._id !== id);
                    localStorage.setItem("mock_all_posts", JSON.stringify(updatedDb));
                }
            } catch (error) {
                // Server down, just delete locally
                setPosts(prev => prev.filter(p => p._id !== id));
                const mockDb = JSON.parse(localStorage.getItem("mock_all_posts") || "[]");
                const updatedDb = mockDb.filter(p => p._id !== id);
                localStorage.setItem("mock_all_posts", JSON.stringify(updatedDb));
            }
        }
    };

    if (!posts) return <div className="loading">Loading your posts...</div>;

    return (
        <div className="my-posts-layout">
            <Sidebar user={user} />

            <div className="my-posts-feed">
                <div className="my-posts-header">
                    <h1 className="my-posts-title">My Posts</h1>
                    <Link to="/create" className="new-post-btn">+ New Post</Link>
                </div>

                {posts.length === 0 ? (
                    <div className="empty-posts">
                        <div className="empty-icon">✍️</div>
                        <h2 className="empty-heading">No posts yet</h2>
                        <p className="empty-sub">You haven't published anything yet. Share your first story with the world!</p>
                        <Link to="/create" className="create-first-btn">Create Your First Post</Link>
                    </div>
                ) : (
                    <div className="my-posts-list">
                        {posts.map(post => (
                            <div key={post._id} className="my-post-card">
                                <div className="my-post-card-header">
                                    <div className="my-post-meta">
                                        {post.title && <h2 className="my-post-title">{post.title}</h2>}
                                        <div className="my-post-date">
                                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                month: 'long', day: 'numeric', year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <div className="my-post-actions">
                                        <Link to={`/post/${post._id}`} className="mp-action-btn view-btn">View</Link>
                                        <button className="mp-action-btn delete-btn" onClick={() => handleDelete(post._id)}>Delete</button>
                                    </div>
                                </div>

                                {/* Image (if any) */}
                                {post.imageUrl && (
                                    <div className="post-card-image-wrapper" style={{ marginTop: '10px', marginBottom: '10px', borderRadius: '8px', overflow: 'hidden' }}>
                                        <img src={post.imageUrl} alt={post.title} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block' }} />
                                    </div>
                                )}

                                <p className="my-post-content">
                                    {post.content.length > 180
                                        ? `${post.content.substring(0, 180)}...`
                                        : post.content}
                                </p>

                                <div className="my-post-stats">
                                    <span>❤️ {post.likes} likes</span>
                                    <span>💬 {post.comments?.length || 0} comments</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyPosts;
