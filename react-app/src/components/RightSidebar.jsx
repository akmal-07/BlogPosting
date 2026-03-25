import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./RightSidebar.css";

function RightSidebar() {
    const [trendingPosts, setTrendingPosts] = useState([
        { id: 1, title: "Getting Started with React", author: "John Doe" },
        { id: 2, title: "Modern CSS Techniques", author: "Jane Smith" },
        { id: 3, title: "JavaScript Best Practices", author: "Mike Johnson" },
        { id: 4, title: "Web Design Trends 2026", author: "Sarah Williams" },
        { id: 5, title: "Building Scalable Apps", author: "David Brown" }
    ]);

    return (
        <div className="right-sidebar">
            <div className="trending-section">
                <h3 className="trending-title">Trending Posts</h3>
                <div className="trending-list">
                    {trendingPosts.map((post, index) => (
                        <div key={post.id} className="trending-item">
                            <div className="trending-rank">{index + 1}</div>
                            <div className="trending-content">
                                <div className="trending-post-title">{post.title}</div>
                                <div className="trending-author">by {post.author}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="suggestions-section">
                <h3 className="suggestions-title">Who to Follow</h3>
                <div className="suggestions-list">
                    <div className="suggestion-item">
                        <div className="suggestion-avatar">A</div>
                        <div className="suggestion-info">
                            <div className="suggestion-name">Alex Turner</div>
                            <div className="suggestion-handle">@alexturner</div>
                        </div>
                        <button className="follow-btn">Follow</button>
                    </div>
                    <div className="suggestion-item">
                        <div className="suggestion-avatar">E</div>
                        <div className="suggestion-info">
                            <div className="suggestion-name">Emma Wilson</div>
                            <div className="suggestion-handle">@emmawilson</div>
                        </div>
                        <button className="follow-btn">Follow</button>
                    </div>
                    <div className="suggestion-item">
                        <div className="suggestion-avatar">R</div>
                        <div className="suggestion-info">
                            <div className="suggestion-name">Ryan Garcia</div>
                            <div className="suggestion-handle">@ryangarcia</div>
                        </div>
                        <button className="follow-btn">Follow</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RightSidebar;
