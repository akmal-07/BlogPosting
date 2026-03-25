const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blogDB').then(async () => {
    const stats = await mongoose.connection.db.stats();
    console.log('--- DB STATS ---');
    console.log('db:', stats.db);
    console.log('collections:', stats.collections);
    console.log('objects:', stats.objects);
    console.log('dataSize:', stats.dataSize);
    console.log('storageSize:', stats.storageSize);
    console.log('indexes:', stats.indexes);
    await mongoose.disconnect();
});
