import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  slackId: string;
  slackUsername: string;
  nachosReceived: number;
  nachosGiven: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyLimit {
  _id?: ObjectId;
  userId: string;
  date: Date;
  nachosGiven: number;
}
