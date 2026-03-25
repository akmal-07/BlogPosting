import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import Sidebar from "../components/Sidebar";
import "./PostDetails.css";

function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Get user from localStorage
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }

        // Fetch post or use dummy data
        fetch(`${API_BASE_URL}/post/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Post not found");
                return res.json();
            })
            .then((data) => {
                setPost(data);
                setLikes(data.likes || 0);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching post:", err);
                // Use dummy data for demo
                const dummyPosts = {
                    "1": {
                        _id: "1",
                        title: "Welcome to BlogSphere",
                        author: "Admin",
                        content: "This is your new blogging platform. Share your thoughts, stories, and ideas with the world. Create short posts or long articles, add images, and connect with other writers.\n\nBlogSphere is designed to be simple yet powerful. Whether you're writing a quick update or a detailed article, we've got you covered. The platform supports both short-form and long-form content, giving you the flexibility to express yourself however you want.\n\nStart by creating your first post using the creation box on the home page, or click the 'Create Post' button to write a full article. Happy writing!",
                        createdAt: new Date().toISOString(),
                        likes: 42
                    },
                    "2": {
                        _id: "2",
                        title: "Getting Started with Blogging",
                        author: "Sarah Johnson",
                        content: "Blogging is a great way to express yourself and share your knowledge. Start by writing about topics you're passionate about. Don't worry about perfection - just start writing!\n\nThe key to successful blogging is consistency. Set a schedule and stick to it. Whether it's once a week or once a day, regular posting helps build an audience.\n\nRemember to engage with your readers. Respond to comments, ask questions, and create a community around your content.",
                        createdAt: new Date(Date.now() - 86400000).toISOString(),
                        likes: 28
                    },
                    "3": {
                        _id: "3",
                        title: "10 Tips for Better Writing",
                        author: "Michael Chen",
                        content: "1. Write every day - Practice makes perfect\n2. Read widely - Learn from other writers\n3. Edit ruthlessly - Cut unnecessary words\n4. Find your voice - Be authentic\n5. Use simple language - Clarity is key\n6. Show, don't tell - Use vivid descriptions\n7. Get feedback - Learn from others\n8. Study great writers - Analyze what works\n9. Practice different styles - Expand your range\n10. Never give up - Keep improving!",
                        createdAt: new Date(Date.now() - 172800000).toISOString(),
                        likes: 156
                    }
                };
                setPost(dummyPosts[id] || dummyPosts["1"]);
                setLikes(dummyPosts[id]?.likes || 0);
                setLoading(false);
            });
    }, [id]);

    const handleLike = () => {
        if (!liked) {
            setLikes(likes + 1);
            setLiked(true);
        } else {
            setLikes(likes - 1);
            setLiked(false);
        }
    };

    if (loading) return <div className="loading">Loading post...</div>;
    if (!post) return <div className="error">Post not found</div>;

    return (
        <div className="post-details-layout">
            <Sidebar user={user} />

            <div className="post-details-container">
                <button className="back-button" onClick={() => navigate("/home")}>
                    ← Back to Feed
                </button>

                <article className="post-article">
                    <header className="post-header">
                        <h1 className="post-full-title">{post.title}</h1>

                        <div className="post-author-section">
                            <div className="author-avatar-large">
                                {post.author?.charAt(0).toUpperCase()}
                            </div>
                            <div className="author-details">
                                <div className="author-name-large">{post.author}</div>
                                <div className="post-date-large">
                                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    </header>

                    {post.imageUrl && (
                        <div className="post-image-full" style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden' }}>
                            <img src={post.imageUrl} alt={post.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', display: 'block' }} />
                        </div>
                    )}

                    <div className="post-content-full">
                        {post.content.split('\n').map((paragraph, index) => (
                            paragraph.trim() && <p key={index}>{paragraph}</p>
                        ))}
                    </div>

                    <div className="post-actions">
                        <button
                            className={`like-button ${liked ? 'liked' : ''}`}
                            onClick={handleLike}
                        >
                            {liked ? '❤️' : '🤍'} {likes} {likes === 1 ? 'Like' : 'Likes'}
                        </button>
                    </div>
                </article>
            </div>

            <div className="post-details-spacer"></div>
        </div>
    );
}

export default PostDetails;
