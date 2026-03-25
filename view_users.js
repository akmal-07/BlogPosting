
const mongoose = require('mongoose');
const User = require('./models/User');

const uri = "mongodb://10.158.74.26:27017/blogDB";

mongoose.connect(uri)
    .then(async () => {
        console.log("Connected to MongoDB...");
        const users = await User.find({});
        console.log("\n--- Registered Users ---");
        users.forEach(user => {
            console.log(`Username: ${user.username}`);
            console.log(`Email:    ${user.email}`);
            console.log(`DOB:      ${user.dob}`);
            console.log("------------------------");
        });
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
