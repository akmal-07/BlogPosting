const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');

async function check() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/blogDB');
        const users = await User.find({}, 'username email');
        console.log("USERS:", users);
        const posts = await Post.countDocuments();
        console.log("POST COUNT:", posts);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
