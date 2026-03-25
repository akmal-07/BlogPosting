const mongoose = require('mongoose');

async function spy(uri, name) {
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log(`[${name}] SUCCESS: connected to ${uri}`);
        console.log(`[${name}] Found ${users.length} users.`);
        for(let u of users) {
            console.log(`   - ${u.username} (${u.email}) | pass: ${u.password.substring(0,6)}...`);
        }
        await mongoose.disconnect();
    } catch(e) {
        console.log(`[${name}] FAILED: ${uri}`);
    }
    console.log('-------------------------');
}

async function main() {
    await spy('mongodb://127.0.0.1:27017/blogDB', 'IPv4');
    await spy('mongodb://[::1]:27017/blogDB', 'IPv6');
}

main();
