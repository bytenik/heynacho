import { App } from '@slack/bolt';
import { getLeaderboard } from '../../services/stats.service.js';
import { formatLeaderboard } from '../../utils/messages.js';

export const registerLeaderboardCommand = (app: App): void => {
  app.command('/nachos-leaderboard', async ({ command, ack, respond }) => {
    await ack();

    try {
      const topReceivers = await getLeaderboard('receivers', 10);
      const topGivers = await getLeaderboard('givers', 10);

      const receiversBoard = formatLeaderboard(topReceivers, 'receivers');
      const giversBoard = formatLeaderboard(topGivers, 'givers');

      await respond({
        text: `${receiversBoard}\n\n${giversBoard}`,
        response_type: 'in_channel',
      });
    } catch (error) {
      console.error('Error in leaderboard command:', error);
      await respond({
        text: 'An error occurred while fetching the leaderboard. Please try again.',
        response_type: 'ephemeral',
      });
    }
  });
};
