import { connectToDatabase, closeDatabase } from './db/client.js';
import { createSlackApp, startSlackApp } from './bot/app.js';
import { resetExpiredLimits } from './db/queries/index.js';

const main = async () => {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await connectToDatabase();

    // Clean up expired daily limits
    await resetExpiredLimits();

    // Create and start Slack app
    console.log('🤖 Starting HeyNacho bot...');
    const app = createSlackApp();
    await startSlackApp(app);

    // Schedule daily cleanup of expired limits (runs every 24 hours)
    setInterval(async () => {
      try {
        await resetExpiredLimits();
        console.log('✅ Cleaned up expired daily limits');
      } catch (error) {
        console.error('❌ Error cleaning up expired limits:', error);
      }
    }, 24 * 60 * 60 * 1000);

    console.log('✅ HeyNacho is ready to spread the nacho love! 🌮');
  } catch (error) {
    console.error('❌ Failed to start HeyNacho:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
const shutdown = async () => {
  console.log('\n👋 Shutting down HeyNacho...');
  try {
    await closeDatabase();
    console.log('✅ Shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the application
main();
