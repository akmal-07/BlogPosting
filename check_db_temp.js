const mongoose = require('mongoose');

async function check(uri, name) {
    try {
        await mongoose.connect(uri);
        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log(`[${name}] ${uri} -> Found ${users.length} users`);
        users.forEach(u => console.log(`  - ${u.username} (${u.email})`));
        await mongoose.disconnect();
    } catch (e) {
        console.error(`[${name}] Error:`, e.message);
    }
}

async function main() {
    await check('mongodb://127.0.0.1:27017/blogDB', 'IPv4');
    await check('mongodb://localhost:27017/blogDB', 'Localhost');
    await check('mongodb://[::1]:27017/blogDB', 'IPv6');
}

main();
