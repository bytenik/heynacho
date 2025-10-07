export const extractUserMentions = (text: string): string[] => {
  const mentionRegex = /<@([A-Z0-9]+)>/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }

  return mentions;
};

export const extractNachoEmoji = (text: string): boolean => {
  return text.includes(':nacho:');
};

export const cleanMessage = (text: string): string => {
  // Remove user mentions and nacho emojis to get the actual message
  return text
    .replace(/<@[A-Z0-9]+>/g, '')
    .replace(/:nacho:/g, '')
    .trim();
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
