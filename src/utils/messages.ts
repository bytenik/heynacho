import { LeaderboardEntry } from '../types/index.js';

export const formatLeaderboard = (
  entries: LeaderboardEntry[],
  type: 'receivers' | 'givers'
): string => {
  if (entries.length === 0) {
    return `No ${type} yet! Be the first to share some :nacho:`;
  }

  const title = type === 'receivers'
    ? ':trophy: Top Nacho Receivers'
    : ':star: Top Nacho Givers';

  const list = entries
    .map((entry, index) => {
      const medal = index === 0 ? ':first_place_medal:'
                  : index === 1 ? ':second_place_medal:'
                  : index === 2 ? ':third_place_medal:'
                  : `${index + 1}.`;
      return `${medal} <@${entry.slackId}> - ${entry.count} :nacho:`;
    })
    .join('\n');

  return `${title}\n\n${list}`;
};

export const formatUserBalance = (
  username: string,
  received: number,
  given: number,
  remaining: number
): string => {
  return `*Nacho Balance for <@${username}>*\n\n` +
    `:nacho: Received: *${received}*\n` +
    `:gift: Given: *${given}*\n` +
    `:calendar: Remaining today: *${remaining}*`;
};

export const helpMessage = (): string => {
  return `*Welcome to HeyNacho!* :nacho:\n\n` +
    `Give nachos to your teammates to show appreciation!\n\n` +
    `*How to give nachos:*\n` +
    `Simply mention a teammate with a :nacho: emoji:\n` +
    `\`@username :nacho: Great job on the presentation!\`\n\n` +
    `*Commands:*\n` +
    `• \`/nachos balance\` - Check your nacho balance\n` +
    `• \`/nachos leaderboard\` - View top nacho receivers and givers\n` +
    `• \`/nachos stats\` - View your personal statistics\n` +
    `• \`/nachos help\` - Show this help message\n\n` +
    `*Rules:*\n` +
    `• You get 5 nachos to give each day\n` +
    `• You can't give nachos to yourself\n` +
    `• Nachos reset daily at midnight\n\n` +
    `Spread the :nacho: love!`;
};
