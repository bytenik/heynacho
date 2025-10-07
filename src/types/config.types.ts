export interface Config {
  slack: {
    botToken: string;
    appToken: string;
    signingSecret: string;
  };
  mongodb: {
    uri: string;
    dbName: string;
  };
  app: {
    port: number;
    dailyNachoLimit: number;
    timezone: string;
  };
}
