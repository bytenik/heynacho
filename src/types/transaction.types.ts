import { ObjectId } from 'mongodb';

export interface Transaction {
  _id?: ObjectId;
  fromUserId: string;
  toUserId: string;
  message: string;
  channel: string;
  timestamp: Date;
}

export interface LeaderboardEntry {
  slackId: string;
  slackUsername: string;
  count: number;
}

export interface Stats {
  totalNachosGiven: number;
  totalNachosReceived: number;
  topReceivers: LeaderboardEntry[];
  topGivers: LeaderboardEntry[];
  recentTransactions: Transaction[];
}
