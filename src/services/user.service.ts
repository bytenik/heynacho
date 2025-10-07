import { getUserBySlackId, findOrCreateUser } from '../db/queries/index.js';
import { User } from '../types/index.js';

export const getUser = async (slackId: string): Promise<User | null> => {
  return getUserBySlackId(slackId);
};

export const ensureUser = async (slackId: string, slackUsername: string): Promise<User> => {
  return findOrCreateUser(slackId, slackUsername);
};
