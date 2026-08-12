import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  dbPath: process.env.DB_PATH || './database.sqlite',
  apiBaseUrl: process.env.API_BASE_URL || '/api',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'change_this_to_a_strong_secret',
  jwtExpiration: process.env.JWT_EXPIRATION || '8h',
};

export default config;
