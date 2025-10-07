import { config } from '../config/index.js';
import {
  findOrCreateUser,
  incrementNachosGiven,
  incrementNachosReceived,
  createTransaction,
  hasReachedDailyLimit,
  incrementDailyLimit,
  getRemainingNachos,
} from '../db/queries/index.js';

export interface GiveNachoResult {
  success: boolean;
  message: string;
  remaining?: number;
}

export const giveNacho = async (
  fromUserId: string,
  fromUsername: string,
  toUserId: string,
  toUsername: string,
  message: string,
  channel: string
): Promise<GiveNachoResult> => {
  try {
    // Check if user is trying to give nachos to themselves
    if (fromUserId === toUserId) {
      return {
        success: false,
        message: "You can't give nachos to yourself! Share the :nacho: love with others.",
      };
    }

    // Check if user has reached their daily limit
    const reachedLimit = await hasReachedDailyLimit(
      fromUserId,
      config.app.dailyNachoLimit
    );

    if (reachedLimit) {
      return {
        success: false,
        message: `You've reached your daily limit of ${config.app.dailyNachoLimit} nachos! Come back tomorrow for more :nacho:`,
      };
    }

    // Ensure both users exist in the database
    await findOrCreateUser(fromUserId, fromUsername);
    await findOrCreateUser(toUserId, toUsername);

    // Increment daily limit
    await incrementDailyLimit(fromUserId);

    // Update nacho counts
    await incrementNachosGiven(fromUserId);
    await incrementNachosReceived(toUserId);

    // Create transaction record
    await createTransaction(fromUserId, toUserId, message, channel);

    // Get remaining nachos
    const remaining = await getRemainingNachos(fromUserId, config.app.dailyNachoLimit);

    return {
      success: true,
      message: `<@${toUsername}> received a :nacho: from <@${fromUsername}>! "${message}"`,
      remaining,
    };
  } catch (error) {
    console.error('Error giving nacho:', error);
    return {
      success: false,
      message: 'An error occurred while giving the nacho. Please try again.',
    };
  }
};

export const getRemainingNachosForUser = async (userId: string): Promise<number> => {
  return getRemainingNachos(userId, config.app.dailyNachoLimit);
};
