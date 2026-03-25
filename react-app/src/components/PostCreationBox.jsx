import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostCreationBox.css";

function PostCreationBox({ user }) {
    const [content, setContent] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    const handleFocus = () => {
        setIsExpanded(true);
    };

    const handlePost = () => {
        if (content.trim()) {
            // For now, just show alert and clear
            // In real app, this would save to backend
            alert("Post created! (This is a demo - not saved to backend)");
            setContent("");
            setIsExpanded(false);
        }
    };

    const handleCreateArticle = () => {
        navigate("/create");
    };

    return (
        <div className="post-creation-box">
            <div className="post-creation-header">
                <div className="post-user-avatar">
                    {user?.username?.charAt(0).toUpperCase()}
                </div>
                <textarea
                    className="post-input"
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={handleFocus}
                    rows={isExpanded ? 4 : 1}
                />
            </div>

            {isExpanded && (
                <div className="post-creation-actions">
                    <div className="post-options">
                        <button className="option-btn" title="Add Image">
                            🖼️ Image
                        </button>
                        <button className="option-btn" onClick={handleCreateArticle} title="Write Article">
                            📄 Article
                        </button>
                    </div>
                    <div className="post-submit-actions">
                        <button
                            className="cancel-btn"
                            onClick={() => {
                                setIsExpanded(false);
                                setContent("");
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="post-btn"
                            onClick={handlePost}
                            disabled={!content.trim()}
                        >
                            Post
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostCreationBox;
