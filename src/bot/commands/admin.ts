import { App } from '@slack/bolt';
import { getOverallStats } from '../../services/stats.service.js';

export const registerAdminCommand = (app: App): void => {
  app.command('/nachos-admin', async ({ command, ack, respond }) => {
    await ack();

    try {
      const stats = await getOverallStats();

      const adminMessage = `*Admin Dashboard* :bar_chart:\n\n` +
        `*Overall Stats:*\n` +
        `• Total Nachos Given: ${stats.totalNachosGiven}\n` +
        `• Total Nachos Received: ${stats.totalNachosReceived}\n` +
        `• Recent Transactions: ${stats.recentTransactions.length}\n\n` +
        `*Top 5 Receivers:*\n` +
        stats.topReceivers.map((e, i) => `${i + 1}. <@${e.slackId}> - ${e.count} :nacho:`).join('\n') +
        `\n\n*Top 5 Givers:*\n` +
        stats.topGivers.map((e, i) => `${i + 1}. <@${e.slackId}> - ${e.count} :nacho:`).join('\n');

      await respond({
        text: adminMessage,
        response_type: 'ephemeral',
      });
    } catch (error) {
      console.error('Error in admin command:', error);
      await respond({
        text: 'An error occurred while fetching admin stats. Please try again.',
        response_type: 'ephemeral',
      });
    }
  });
};
