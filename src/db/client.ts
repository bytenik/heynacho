import { MongoClient, Db } from 'mongodb';
import { config } from '../config/index.js';

let client: MongoClient;
let db: Db;

export const connectToDatabase = async (): Promise<Db> => {
  try {
    client = new MongoClient(config.mongodb.uri);
    await client.connect();
    db = client.db(config.mongodb.dbName);

    console.log(`✅ Connected to MongoDB: ${config.mongodb.dbName}`);

    // Create indexes
    await createIndexes();

    return db;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
};

const createIndexes = async (): Promise<void> => {
  try {
    // Users collection indexes
    await db.collection('users').createIndex({ slackId: 1 }, { unique: true });
    await db.collection('users').createIndex({ nachosReceived: -1 });
    await db.collection('users').createIndex({ nachosGiven: -1 });

    // Transactions collection indexes
    await db.collection('transactions').createIndex({ timestamp: -1 });
    await db.collection('transactions').createIndex({ fromUserId: 1 });
    await db.collection('transactions').createIndex({ toUserId: 1 });

    // Daily limits collection indexes
    await db.collection('dailyLimits').createIndex(
      { userId: 1, date: 1 },
      { unique: true }
    );

    console.log('✅ Database indexes created');
  } catch (error) {
    console.error('❌ Failed to create indexes:', error);
    throw error;
  }
};

export const getDatabase = (): Db => {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase() first.');
  }
  return db;
};

export const closeDatabase = async (): Promise<void> => {
  if (client) {
    await client.close();
    console.log('✅ MongoDB connection closed');
  }
};
