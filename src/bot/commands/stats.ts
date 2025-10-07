import { App } from '@slack/bolt';
import { getUserStats } from '../../services/stats.service.js';
import { formatDate } from '../../utils/helpers.js';

export const registerStatsCommand = (app: App): void => {
  app.command('/nachos-stats', async ({ command, ack, respond }) => {
    await ack();

    try {
      const userId = command.user_id;
      const stats = await getUserStats(userId);

      let recentActivity = '';
      if (stats.recentTransactions.length > 0) {
        const transactions = stats.recentTransactions
          .slice(0, 5)
          .map(t => {
            const direction = t.fromUserId === userId ? 'to' : 'from';
            const otherUserId = t.fromUserId === userId ? t.toUserId : t.fromUserId;
            return `• ${direction} <@${otherUserId}>: "${t.message}" (${formatDate(t.timestamp)})`;
          })
          .join('\n');
        recentActivity = `\n\n*Recent Activity:*\n${transactions}`;
      } else {
        recentActivity = `\n\n_No recent activity. Start giving nachos!_`;
      }

      const statsMessage = `*Your Nacho Stats* :nacho:\n\n` +
        `:inbox_tray: Total Received: *${stats.nachosReceived}*\n` +
        `:outbox_tray: Total Given: *${stats.nachosGiven}*` +
        recentActivity;

      await respond({
        text: statsMessage,
        response_type: 'ephemeral',
      });
    } catch (error) {
      console.error('Error in stats command:', error);
      await respond({
        text: 'An error occurred while fetching your stats. Please try again.',
        response_type: 'ephemeral',
      });
    }
  });
};
