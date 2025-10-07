import { getUsersCollection } from '../collections.js';
import { User } from '../../types/index.js';

export const findOrCreateUser = async (
  slackId: string,
  slackUsername: string
): Promise<User> => {
  const collection = getUsersCollection();

  const existingUser = await collection.findOne({ slackId });
  if (existingUser) {
    // Update username if it changed
    if (existingUser.slackUsername !== slackUsername) {
      await collection.updateOne(
        { slackId },
        {
          $set: {
            slackUsername,
            updatedAt: new Date(),
          },
        }
      );
      existingUser.slackUsername = slackUsername;
    }
    return existingUser;
  }

  const newUser: User = {
    slackId,
    slackUsername,
    nachosReceived: 0,
    nachosGiven: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await collection.insertOne(newUser);
  return newUser;
};

export const getUserBySlackId = async (slackId: string): Promise<User | null> => {
  return getUsersCollection().findOne({ slackId });
};

export const incrementNachosGiven = async (slackId: string): Promise<void> => {
  await getUsersCollection().updateOne(
    { slackId },
    {
      $inc: { nachosGiven: 1 },
      $set: { updatedAt: new Date() },
    }
  );
};

export const incrementNachosReceived = async (slackId: string): Promise<void> => {
  await getUsersCollection().updateOne(
    { slackId },
    {
      $inc: { nachosReceived: 1 },
      $set: { updatedAt: new Date() },
    }
  );
};

export const getTopReceivers = async (limit: number = 10): Promise<User[]> => {
  return getUsersCollection()
    .find()
    .sort({ nachosReceived: -1 })
    .limit(limit)
    .toArray();
};

export const getTopGivers = async (limit: number = 10): Promise<User[]> => {
  return getUsersCollection()
    .find()
    .sort({ nachosGiven: -1 })
    .limit(limit)
    .toArray();
};
