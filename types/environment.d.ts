export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PORT: string;
      MONGO_URI: string;
      TEST_MONGO_URI: string;

      LOGIN_TOKEN_SECRET: string;
      LOGIN_TOKEN_EXPIRY: string;
    }
  }
}
