
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Post = require('./models/Post');

const app = express();
const port = 3000;
const JWT_SECRET = 'blogsphere_secret_key_2024';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/blogDB")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('BlogSphere API is running.');
});

// Register Endpoint - hashes password before saving
app.post('/register', async (req, res) => {
    try {
        const { username, email, password, dob } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ error: 'Username or email already taken' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, dob });
        await newUser.save();

        res.status(201).json({ message: 'Account created successfully! Please log in.' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
});

// Login Endpoint - supports both old plain-text and new bcrypt-hashed passwords
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'No account found with that username.' });
        }

        let isMatch = false;

        // Check if stored password is bcrypt hash (starts with $2a$ or $2b$)
        const isBcrypt = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');

        if (isBcrypt) {
            // New account: compare with bcrypt
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // Old account: plain-text comparison
            isMatch = (user.password === password);

            // Auto-upgrade plain-text password to bcrypt hash
            if (isMatch) {
                const hashedPassword = await bcrypt.hash(password, 10);
                await User.updateOne({ _id: user._id }, { password: hashedPassword });
            }
        }

        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password. Please try again.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed. Please try again later.' });
    }
});

// --- Blog Post Routes ---

// 1. Create a Post
app.post('/createPost', async (req, res) => {
    try {
        const { title, content, author, tags, imageUrl } = req.body;
        const newPost = new Post({ title, content, author, tags: tags || [], imageUrl });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post', details: error.message });
    }
});

// 2. Get All Posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }); // Newest first
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
    }
});

// 3. Get Single Post
app.get('/post/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post', details: error.message });
    }
});

// 3a. Get Posts by Username
app.get('/user/posts/:username', async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.username }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user posts', details: error.message });
    }
});

// 3b. Delete a Post
app.delete('/post/:id', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post', details: error.message });
    }
});

// --- Settings Routes ---

// 4. Update Username
app.put('/update-username', async (req, res) => {
    try {
        const { userId, newUsername } = req.body;

        // Check if username is already taken
        const existing = await User.findOne({ username: newUsername });
        if (existing && existing._id.toString() !== userId) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        await User.findByIdAndUpdate(userId, { username: newUsername });
        res.json({ message: 'Username updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update username', details: error.message });
    }
});

// 5. Update Password
app.put('/update-password', async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isBcrypt = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
        let isMatch = false;
        if (isBcrypt) {
            isMatch = await bcrypt.compare(currentPassword, user.password);
        } else {
            isMatch = (user.password === currentPassword);
        }

        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash and save new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update password', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
