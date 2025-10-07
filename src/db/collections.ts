import { Collection } from 'mongodb';
import { getDatabase } from './client.js';
import { User, DailyLimit, Transaction } from '../types/index.js';

export const getUsersCollection = (): Collection<User> => {
  return getDatabase().collection<User>('users');
};

export const getDailyLimitsCollection = (): Collection<DailyLimit> => {
  return getDatabase().collection<DailyLimit>('dailyLimits');
};

export const getTransactionsCollection = (): Collection<Transaction> => {
  return getDatabase().collection<Transaction>('transactions');
};
