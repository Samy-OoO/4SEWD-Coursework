import { Sequelize } from 'sequelize';
import config from './env.js';

// A single shared Sequelize instance, talking to a local SQLite file.
// Swapping to Postgres/MySQL later only means changing this block.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: config.dbPath,
  logging: config.nodeEnv === 'development' ? console.log : false,
});

export default sequelize;
