
const mongoose = require('mongoose');

// Try connecting to localhost first
const uri = "mongodb://127.0.0.1:27017/blogDB";
console.log(`Attempting to connect to ${uri}...`);

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log("Successfully connected to MongoDB on localhost!");
        process.exit(0);
    })
    .catch(err => {
        console.error("Failed to connect to localhost:", err.message);
        process.exit(1);
    });
