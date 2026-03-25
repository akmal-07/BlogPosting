const mongoose = require('mongoose');
const fs = require('fs');

async function check() {
    let result = {};
    
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/blogDB');
        const users127 = await mongoose.connection.db.collection('users').find({}).toArray();
        result['127.0.0.1'] = users127.length;
        await mongoose.disconnect();
    } catch(e) { result['127.0.0.1'] = 'error'; }

    try {
        await mongoose.connect('mongodb://localhost:27017/blogDB');
        const usersLocal = await mongoose.connection.db.collection('users').find({}).toArray();
        result['localhost'] = usersLocal.length;
        await mongoose.disconnect();
    } catch(e) { result['localhost'] = 'error'; }

    fs.writeFileSync('db_check.json', JSON.stringify(result));
}

check();
