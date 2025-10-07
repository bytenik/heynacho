import { App, SlackCommandMiddlewareArgs, SlashCommand } from '@slack/bolt';
import { getUser } from '../../services/user.service.js';
import { getRemainingNachosForUser } from '../../services/nacho.service.js';
import { formatUserBalance } from '../../utils/messages.js';

export const registerBalanceCommand = (app: App): void => {
  app.command('/nachos-balance', async ({ command, ack, respond }) => {
    await ack();

    try {
      const userId = command.user_id;
      const user = await getUser(userId);

      if (!user) {
        await respond({
          text: "You haven't given or received any nachos yet! Start spreading the :nacho: love!",
          response_type: 'ephemeral',
        });
        return;
      }

      const remaining = await getRemainingNachosForUser(userId);
      const balanceMessage = formatUserBalance(
        userId,
        user.nachosReceived,
        user.nachosGiven,
        remaining
      );

      await respond({
        text: balanceMessage,
        response_type: 'ephemeral',
      });
    } catch (error) {
      console.error('Error in balance command:', error);
      await respond({
        text: 'An error occurred while fetching your balance. Please try again.',
        response_type: 'ephemeral',
      });
    }
  });
};
