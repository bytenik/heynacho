import { App } from '@slack/bolt';
import { extractUserMentions, extractNachoEmoji, cleanMessage } from '../../utils/helpers.js';
import { giveNacho } from '../../services/nacho.service.js';

export const registerMessageEvents = (app: App): void => {
  app.message(async ({ message, client }) => {
    // Only process regular messages with text and a user
    if (
      message.subtype ||
      !('text' in message) ||
      !('user' in message) ||
      !message.text
    ) {
      return;
    }

    const text = message.text;

    // Check if the message contains a nacho emoji
    if (!extractNachoEmoji(text)) {
      return;
    }

    // Extract user mentions
    const mentions = extractUserMentions(text);

    if (mentions.length === 0) {
      await client.chat.postMessage({
        channel: message.channel,
        text: "Don't forget to mention someone to give them a :nacho:! Example: `@user :nacho: Great work!`",
        thread_ts: message.ts,
      });
      return;
    }

    const fromUserId = message.user;
    const channel = message.channel;

    // Get sender's username
    let fromUsername = fromUserId;
    try {
      const userInfo = await client.users.info({ user: fromUserId });
      fromUsername = userInfo.user?.name || fromUserId;
    } catch (error) {
      console.error('Error fetching user info:', error);
    }

    // Clean the message
    const cleanedMessage = cleanMessage(text) || 'Thanks!';

    // Give nachos to each mentioned user
    for (const toUserId of mentions) {
      // Get recipient's username
      let toUsername = toUserId;
      try {
        const userInfo = await client.users.info({ user: toUserId });
        toUsername = userInfo.user?.name || toUserId;
      } catch (error) {
        console.error('Error fetching user info:', error);
      }

      // Give the nacho
      const result = await giveNacho(
        fromUserId,
        fromUsername,
        toUserId,
        toUsername,
        cleanedMessage,
        channel
      );

      // Post result to channel
      if (result.success) {
        const remainingText = result.remaining !== undefined
          ? `\n\n_You have ${result.remaining} :nacho: left to give today._`
          : '';

        await client.chat.postMessage({
          channel: message.channel,
          text: result.message + remainingText,
        });
      } else {
        await client.chat.postMessage({
          channel: message.channel,
          text: result.message,
          thread_ts: message.ts,
        });
      }
    }
  });
};
