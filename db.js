const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
let client;
let database;

async function connectToDatabase() {
    if (!client) {
        client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        try {
            await client.connect();
            console.log('Connected to MongoDB');
            database = client.db('Saymuse');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            process.exit(1);
        }
    }
    return database;
}

async function getCollection(collectionName) {
    const db = await connectToDatabase();
    return db.collection(collectionName);
}

module.exports = {
    connectToDatabase,
    getCollection,
};
