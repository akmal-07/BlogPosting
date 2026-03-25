import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import Sidebar from "../components/Sidebar";
import "./Home.css";

const FILTER_TAGS = [
    "All", "Cricket", "Movies", "F1", "Robotics", "Studies",
    "Technology", "Music", "Travel", "Food", "Fitness",
    "Gaming", "Science", "Art", "Fashion", "Photography",
    "Nature", "Books", "Sports", "Business", "Health"
];

const DEFAULT_WELCOME_POST = {
    _id: "admin-welcome-1",
    title: "Welcome to BlogSphere 🎉",
    author: "Admin",
    content: "This is your new blogging platform. Share your thoughts, stories, and ideas with the world. Create short posts or long articles, add images, and connect with other writers. We're so excited to have you here!",
    createdAt: new Date().toISOString(),
    likes: 42,
    tags: ["Technology", "Books"],
    comments: [
        { id: 1, author: "Jane", text: "Awesome platform!", createdAt: new Date(Date.now() - 3600000).toISOString() }
    ]
};

function PostCard({ post, currentUser }) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(post.comments || []);
    const [newComment, setNewComment] = useState("");

    const handleLike = () => {
        if (liked) {
            setLikeCount(c => c - 1);
        } else {
            setLikeCount(c => c + 1);
        }
        setLiked(!liked);
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        const comment = {
            id: Date.now(),
            author: currentUser?.username || "You",
            text: newComment.trim(),
            createdAt: new Date().toISOString()
        };
        setComments(prev => [...prev, comment]);
        setNewComment("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    const isLong = post.content.length > 220;

    return (
        <div className="post-card">
            {/* Header */}
            <div className="post-card-header">
                <div className="post-author-avatar">
                    {post.author?.charAt(0).toUpperCase()}
                </div>
                <div className="post-author-info">
                    <div className="post-author-name">{post.author}</div>
                    <div className="post-date">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                        })}
                    </div>
                </div>
            </div>

            {/* Title */}
            {post.title && <h2 className="post-card-title">{post.title}</h2>}

            {/* Image (if any) */}
            {post.imageUrl && (
                <div className="post-card-image-wrapper" style={{ marginTop: '10px', marginBottom: '10px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                    {post.tags.map(tag => (
                        <span key={tag} className="post-tag">{tag}</span>
                    ))}
                </div>
            )}

            {/* Content */}
            <p className="post-card-content">
                {isLong ? `${post.content.substring(0, 220)}...` : post.content}
            </p>

            {/* Footer: actions row */}
            <div className="post-card-footer">
                <div className="post-actions-row">
                    <button
                        className={`action-btn like-action-btn ${liked ? "liked" : ""}`}
                        onClick={handleLike}
                    >
                        <span className="action-icon">{liked ? "❤️" : "🤍"}</span>
                        <span className="action-count">{likeCount}</span>
                    </button>

                    <button
                        className={`action-btn comment-action-btn ${showComments ? "active" : ""}`}
                        onClick={() => setShowComments(!showComments)}
                    >
                        <span className="action-icon">💬</span>
                        <span className="action-count">{comments.length}</span>
                    </button>

                    {isLong && (
                        <Link to={`/post/${post._id}`} className="read-more-btn-inline">
                            Read More →
                        </Link>
                    )}
                </div>
            </div>

            {/* Comments section */}
            {showComments && (
                <div className="comments-section">
                    {comments.length > 0 && (
                        <div className="comments-list">
                            {comments.map(c => (
                                <div key={c.id} className="comment-item">
                                    <div className="comment-avatar">
                                        {c.author?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="comment-body">
                                        <span className="comment-author">{c.author}</span>
                                        <span className="comment-text">{c.text}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="add-comment-row">
                        <div className="comment-avatar own-avatar">
                            {currentUser?.username?.charAt(0).toUpperCase() || "Y"}
                        </div>
                        <input
                            className="comment-input"
                            type="text"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className="comment-submit-btn"
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                        >
                            Post
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const tagScrollRef = useRef(null);

    const scrollTags = (dir) => {
        if (tagScrollRef.current) {
            tagScrollRef.current.scrollBy({ left: dir * 160, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) setUser(JSON.parse(loggedInUser));

        // Initialize local mock DB if doesn't exist yet
        let mockPosts = JSON.parse(localStorage.getItem("mock_all_posts") || "[]");
        if (mockPosts.length === 0) {
            mockPosts = [DEFAULT_WELCOME_POST];
            localStorage.setItem("mock_all_posts", JSON.stringify(mockPosts));
        }

        // Set local posts initially
        setPosts(mockPosts);
        setLoading(false);

        // Optional: still try the real backend, if it connects and works,
        // it can overwrite the mock posts.
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);
        fetch(`${API_BASE_URL}/posts`, { signal: controller.signal })
            .then(res => {
                if (res.ok) return res.json();
                throw new Error("Server error");
            })
            .then(data => { if (data.length > 0) setPosts(data); })
            .catch(() => { })
            .finally(() => clearTimeout(timeout));
    }, []);

    const filteredPosts = activeFilter === "All"
        ? posts
        : posts.filter(p => p.tags && p.tags.includes(activeFilter));

    if (loading) return <div className="loading">Loading posts...</div>;

    return (
        <div className="home-layout">
            <Sidebar user={user} />

            <div className="main-feed">
                {/* Sticky header */}
                <div className="feed-header">
                    <div className="feed-header-inner">
                        <h1 className="feed-title">✦ Feed</h1>
                        <span className="feed-header-badge">🔥 {posts.length} posts</span>
                    </div>

                    {/* Tag Filter Bar */}
                    <div className="tag-filter-bar">
                        <button className="tag-scroll-btn" onClick={() => scrollTags(-1)}>‹</button>
                        <div className="tag-filter-scroll" ref={tagScrollRef}>
                            {FILTER_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    className={`filter-tag ${activeFilter === tag ? "active" : ""}`}
                                    onClick={() => setActiveFilter(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                        <button className="tag-scroll-btn" onClick={() => scrollTags(1)}>›</button>
                    </div>
                </div>

                {/* Compact write bar */}
                <div className="quick-post-box">
                    <div className="qp-avatar">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <Link to="/create" className="qp-input-fake">
                        What's on your mind, {user?.username?.split(" ")[0] || "there"}?
                    </Link>
                    <Link to="/create" className="qp-write-btn">
                        ✍️ Write
                    </Link>
                </div>

                <div className="posts-list">
                    {filteredPosts.map(post => (
                        <PostCard key={post._id} post={post} currentUser={user} />
                    ))}
                    {filteredPosts.length === 0 && (
                        <div className="no-posts">
                            <p>No posts found for "{activeFilter}". Try a different tag!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
