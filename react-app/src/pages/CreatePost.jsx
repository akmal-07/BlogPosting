import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import Sidebar from "../components/Sidebar";
import "./CreatePost.css";

const ALL_TAGS = [
    "Cricket", "Movies", "F1", "Robotics", "Studies",
    "Technology", "Music", "Travel", "Food", "Fitness",
    "Gaming", "Science", "Art", "Fashion", "Photography",
    "Nature", "Books", "Sports", "Business", "Health"
];

function CreatePost({ user }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [showAttachPanel, setShowAttachPanel] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    /* ---- Tag Handling ---- */
    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    /* ---- Media Handling ---- */
    const handleMediaSelect = (files) => {
        const items = Array.from(files).map(file => ({
            type: file.type.startsWith("video") ? "video" : "image",
            url: URL.createObjectURL(file),
            name: file.name,
            file
        }));
        setMediaFiles(prev => [...prev, ...items].slice(0, 6));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleMediaSelect(e.dataTransfer.files);
    };

    const removeMedia = (idx) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== idx));
    };

    /* ---- Submit ---- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            return alert("Please add a title for your post");
        }
        if (!content.trim()) return alert("Please add some content");
        if (selectedTags.length === 0) {
            return alert("Please select at least one tag for your post");
        }

        let imageUrl = null;
        if (mediaFiles.length > 0 && mediaFiles[0].file) {
            // Convert to base64 so we can easily send to our simple backend
            imageUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(mediaFiles[0].file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }

        const newPost = {
            title,
            content,
            author: user?.username || "Anonymous",
            tags: selectedTags,
            imageUrl
        };

        try {
            const res = await fetch(`${API_BASE_URL}/createPost`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPost),
            });
            if (res.ok) { navigate("/home"); return; }
            throw new Error("Server error");
        } catch (_) { 
            // Fallback: save to LocalStorage mock DB
            const mockDb = JSON.parse(localStorage.getItem("mock_all_posts") || "[]");
            newPost._id = `mock-${Date.now()}`;
            newPost.createdAt = new Date().toISOString();
            newPost.likes = 0;
            newPost.comments = [];
            mockDb.unshift(newPost); // Add to top
            localStorage.setItem("mock_all_posts", JSON.stringify(mockDb));
            
            navigate("/home");
        }
    };

    return (
        <div className="create-post-layout">
            <Sidebar user={user} setUser={() => { }} />

            <div className="create-post-container">
                {/* Animated Background Mesh */}
                <div className="create-hero-mesh">
                    <div className="mesh-orb orb1" />
                    <div className="mesh-orb orb2" />
                    <div className="mesh-orb orb3" />
                </div>

                {/* Header */}
                <div className="create-post-header">
                    <button className="back-button-create" onClick={() => navigate("/home")}>
                        <span className="back-icon">←</span> Back
                    </button>
                    <h1 className="create-post-title">Create Story</h1>
                </div>

                <form onSubmit={handleSubmit} className="create-post-form">
                    <div className="create-post-left">
                        {/* Title */}
                        <div className="form-group title-group">
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="title-input-neat"
                                placeholder="Title"
                                autoComplete="off"
                            />
                        </div>

                        {/* Content */}
                        <div className="form-group content-group">
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                className="content-textarea-neat"
                                rows={12}
                                placeholder="Tell your story..."
                            />
                        </div>
                    </div>

                    <div className="create-post-right">
                        {/* Premium Tag Selector */}
                        <div className="form-group tags-group">
                            <div className="tags-header">
                                <label className="form-label-neat">Topics</label>
                                <span className="tag-hint-neat">Select up to 3 topics to help readers find your post.</span>
                            </div>
                            <div className="tags-selector-neat">
                                {ALL_TAGS.map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        className={`tag-pill ${selectedTags.includes(tag) ? "selected" : ""}`}
                                        onClick={() => toggleTag(tag)}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ---- Attachment Preview (only shown when files added) ---- */}
                        {mediaFiles.length > 0 && (
                            <div className="media-preview-grid-neat">
                                {mediaFiles.map((m, i) => (
                                    <div key={i} className="media-preview-item-neat">
                                        {m.type === "image"
                                            ? <img src={m.url} alt={m.name} className="preview-media-neat" />
                                            : <video src={m.url} className="preview-media-neat" controls />}
                                        <button type="button" className="remove-media-btn-neat" onClick={() => removeMedia(i)}>✕</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ---- Attach panel (drag & drop) ---- */}
                        {showAttachPanel && (
                            <div
                                className={`attach-drop-zone-neat ${isDragging ? "dragging" : ""}`}
                                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current.click()}
                            >
                                <div className="attach-drop-content-neat">
                                    <span className="attach-drop-icon-neat">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    </span>
                                    <span className="attach-drop-title-neat">Upload Media</span>
                                    <span className="attach-drop-text-neat">
                                        {isDragging ? "Drop your files right here!" : "Drag & drop, or click"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            style={{ display: "none" }}
                            onChange={e => handleMediaSelect(e.target.files)}
                        />

                        {/* Actions */}
                        <div className="form-actions-neat">
                            {/* Pin / attach toggle */}
                            <button
                                type="button"
                                className={`pin-btn-neat ${showAttachPanel ? "pin-active" : ""}`}
                                onClick={() => setShowAttachPanel(p => !p)}
                                title="Attach media"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                </svg>
                                {mediaFiles.length > 0 && (
                                    <span className="pin-badge-neat">{mediaFiles.length}</span>
                                )}
                            </button>

                            <div className="form-actions-right-neat">
                                <button type="submit" className="publish-button-neat">
                                    Publish
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="create-post-spacer" />
        </div>
    );
}

export default CreatePost;
