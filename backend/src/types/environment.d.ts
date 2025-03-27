// This file lets us add types to our environment variables.
// https://stackoverflow.com/a/53981706
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: number;
      NODE_ENV: 'development' | 'production';
      PGSQL_USER: string;
      PGSQL_PASSWORD: string;
      PGSQL_HOST: string;
      PGSQL_PORT: number;
      PGSQL_DATABASE: string;
      JWT_SECRET: string;
      JWT_EXPIRY: string;
      BCRYPT_SALT_ROUNDS: number;
    }
  }
}

export {};
