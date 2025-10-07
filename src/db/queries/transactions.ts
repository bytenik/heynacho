import { getTransactionsCollection } from '../collections.js';
import { Transaction } from '../../types/index.js';

export const createTransaction = async (
  fromUserId: string,
  toUserId: string,
  message: string,
  channel: string
): Promise<Transaction> => {
  const transaction: Transaction = {
    fromUserId,
    toUserId,
    message,
    channel,
    timestamp: new Date(),
  };

  await getTransactionsCollection().insertOne(transaction);
  return transaction;
};

export const getRecentTransactions = async (limit: number = 10): Promise<Transaction[]> => {
  return getTransactionsCollection()
    .find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();
};

export const getTransactionsByUser = async (
  userId: string,
  limit: number = 10
): Promise<Transaction[]> => {
  return getTransactionsCollection()
    .find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();
};

export const getTransactionCountForUser = async (userId: string): Promise<{
  given: number;
  received: number;
}> => {
  const given = await getTransactionsCollection().countDocuments({ fromUserId: userId });
  const received = await getTransactionsCollection().countDocuments({ toUserId: userId });

  return { given, received };
};

export const getTransactionsInDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<Transaction[]> => {
  return getTransactionsCollection()
    .find({
      timestamp: {
        $gte: startDate,
        $lte: endDate,
      },
    })
    .sort({ timestamp: -1 })
    .toArray();
};
