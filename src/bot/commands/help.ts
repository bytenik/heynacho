import { App } from '@slack/bolt';
import { helpMessage } from '../../utils/messages.js';

export const registerHelpCommand = (app: App): void => {
  app.command('/nachos-help', async ({ ack, respond }) => {
    await ack();

    await respond({
      text: helpMessage(),
      response_type: 'ephemeral',
    });
  });
};
