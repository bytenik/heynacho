import { App } from '@slack/bolt';
import { config } from '../config/index.js';
import { registerMessageEvents } from './events/message.js';
import { registerBalanceCommand } from './commands/balance.js';
import { registerLeaderboardCommand } from './commands/leaderboard.js';
import { registerStatsCommand } from './commands/stats.js';
import { registerHelpCommand } from './commands/help.js';
import { registerAdminCommand } from './commands/admin.js';

export const createSlackApp = (): App => {
  const app = new App({
    token: config.slack.botToken,
    appToken: config.slack.appToken,
    signingSecret: config.slack.signingSecret,
    socketMode: true,
  });

  // Register event handlers
  registerMessageEvents(app);

  // Register slash commands
  registerBalanceCommand(app);
  registerLeaderboardCommand(app);
  registerStatsCommand(app);
  registerHelpCommand(app);
  registerAdminCommand(app);

  return app;
};

export const startSlackApp = async (app: App): Promise<void> => {
  await app.start();
  console.log('⚡️ HeyNacho bot is running!');
};
