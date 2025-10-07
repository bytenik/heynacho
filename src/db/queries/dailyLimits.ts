import { getDailyLimitsCollection } from '../collections.js';
import { DailyLimit } from '../../types/index.js';

const getTodayDate = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const getDailyLimit = async (userId: string): Promise<DailyLimit | null> => {
  const today = getTodayDate();
  return getDailyLimitsCollection().findOne({
    userId,
    date: today,
  });
};

export const incrementDailyLimit = async (userId: string): Promise<number> => {
  const today = getTodayDate();
  const collection = getDailyLimitsCollection();

  const result = await collection.findOneAndUpdate(
    { userId, date: today },
    {
      $inc: { nachosGiven: 1 },
      $setOnInsert: { userId, date: today },
    },
    { upsert: true, returnDocument: 'after' }
  );

  return result?.nachosGiven || 0;
};

export const getRemainingNachos = async (
  userId: string,
  dailyLimit: number
): Promise<number> => {
  const dailyLimitDoc = await getDailyLimit(userId);
  const used = dailyLimitDoc?.nachosGiven || 0;
  return Math.max(0, dailyLimit - used);
};

export const hasReachedDailyLimit = async (
  userId: string,
  dailyLimit: number
): Promise<boolean> => {
  const remaining = await getRemainingNachos(userId, dailyLimit);
  return remaining <= 0;
};

export const resetExpiredLimits = async (): Promise<void> => {
  const today = getTodayDate();
  await getDailyLimitsCollection().deleteMany({
    date: { $lt: today },
  });
};
