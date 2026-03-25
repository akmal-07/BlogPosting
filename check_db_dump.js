const mongoose = require('mongoose');
const fs = require('fs');

mongoose.connect('mongodb://localhost:27017/blogDB').then(async () => {
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    let txt = "=== VERIFIED USERS IN mongodb://localhost:27017/blogDB ===\n";
    txt += "Total Users Found: " + users.length + "\n\n";
    for(let u of users) {
        let postCount = await mongoose.connection.db.collection('posts').countDocuments({author: u.username});
        txt += `Username: ${u.username}\nEmail: ${u.email}\nPosts: ${postCount}\n-----------------------\n`;
    }
    
    txt += "\nNOTE: If MongoDB Compass shows only 2 users, it is showing you a CACHED (old) visual. Please close the 'BlogPosting' tab inside Compass entirely, and open the users collection again, or click the circular refresh icon next to '1-2 of 2'.";
    
    fs.writeFileSync('C:\\Users\\HP\\Desktop\\Verified_Users.txt', txt);
    await mongoose.disconnect();
});
