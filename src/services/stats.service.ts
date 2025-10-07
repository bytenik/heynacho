import {
  getTopReceivers,
  getTopGivers,
  getRecentTransactions,
  getTransactionsByUser,
  getTransactionCountForUser,
  getTransactionsInDateRange,
} from '../db/queries/index.js';
import { LeaderboardEntry, Transaction, Stats } from '../types/index.js';

export const getLeaderboard = async (
  type: 'receivers' | 'givers',
  limit: number = 10
): Promise<LeaderboardEntry[]> => {
  const users = type === 'receivers'
    ? await getTopReceivers(limit)
    : await getTopGivers(limit);

  return users.map(user => ({
    slackId: user.slackId,
    slackUsername: user.slackUsername,
    count: type === 'receivers' ? user.nachosReceived : user.nachosGiven,
  }));
};

export const getUserStats = async (userId: string): Promise<{
  nachosReceived: number;
  nachosGiven: number;
  recentTransactions: Transaction[];
}> => {
  const counts = await getTransactionCountForUser(userId);
  const recentTransactions = await getTransactionsByUser(userId, 5);

  return {
    nachosReceived: counts.received,
    nachosGiven: counts.given,
    recentTransactions,
  };
};

export const getOverallStats = async (): Promise<Stats> => {
  const topReceivers = await getLeaderboard('receivers', 5);
  const topGivers = await getLeaderboard('givers', 5);
  const recentTransactions = await getRecentTransactions(10);

  const totalNachosGiven = topGivers.reduce((sum, entry) => sum + entry.count, 0);
  const totalNachosReceived = topReceivers.reduce((sum, entry) => sum + entry.count, 0);

  return {
    totalNachosGiven,
    totalNachosReceived,
    topReceivers,
    topGivers,
    recentTransactions,
  };
};

export const getWeeklyStats = async (): Promise<Transaction[]> => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return getTransactionsInDateRange(oneWeekAgo, now);
};

export const getMonthlyStats = async (): Promise<Transaction[]> => {
  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return getTransactionsInDateRange(oneMonthAgo, now);
};
