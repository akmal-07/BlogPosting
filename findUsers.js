const mongoose = require('mongoose');

async function findUsers() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017');
        const client = mongoose.connection.client;
        const adminDb = client.db('admin');
        const dbs = await adminDb.admin().listDatabases();
        
        let found = false;
        
        for (const dbInfo of dbs.databases) {
            const db = client.db(dbInfo.name);
            const cols = await db.listCollections().toArray();
            for (const col of cols) {
                const docs = await db.collection(col.name).find({
                    $or: [
                        { username: /ohit/i },
                        { username: /arsha/i },
                        { email: /ohit/i },
                        { email: /arsha/i }
                    ]
                }).toArray();
                
                if (docs.length > 0) {
                    console.log(`FOUND ${docs.length} ACCOUNTS IN DB: "${dbInfo.name}", COLLECTION: "${col.name}"`);
                    docs.forEach(d => console.log(' ->', d.username, d.email));
                    found = true;
                }
            }
        }
        
        if (!found) {
            console.log('Could not find Gohit or Harsha on 127.0.0.1:27017');
        }
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        process.exit(0);
    }
}

findUsers();
