import app from './app.js';
import config from './config/env.js';
import { sequelize } from './models/index.js';
import { seedIfEmpty } from './utils/seed.js';

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Connected to SQLite database.');

    // Code-first: create tables from the models if they don't exist yet,
    // and add any new columns (e.g. sku, minStock) to existing ones without
    // dropping data. (In production you'd use migrations instead - slide 28.)
    await sequelize.sync();

    await seedIfEmpty();

    app.listen(config.port, () => {
      console.log(`API server listening on http://localhost:${config.port}${config.apiBaseUrl}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
