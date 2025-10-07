import dotenv from 'dotenv';
import { Config } from '../types/index.js';

dotenv.config();

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const config: Config = {
  slack: {
    botToken: getEnvVar('SLACK_BOT_TOKEN'),
    appToken: getEnvVar('SLACK_APP_TOKEN'),
    signingSecret: getEnvVar('SLACK_SIGNING_SECRET'),
  },
  mongodb: {
    uri: getEnvVar('MONGODB_URI', 'mongodb://localhost:27017'),
    dbName: getEnvVar('MONGODB_DB_NAME', 'nachobot'),
  },
  app: {
    port: parseInt(getEnvVar('PORT', '3000'), 10),
    dailyNachoLimit: parseInt(getEnvVar('DAILY_NACHO_LIMIT', '5'), 10),
    timezone: getEnvVar('TZ', 'UTC'),
  },
};
