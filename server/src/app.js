import express from 'express';
import cors from 'cors';
import config from './config/env.js';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Only the React dev server's origin may call this API. Without this,
// the browser blocks every fetch() from localhost:5173 with a CORS error.
app.use(
  cors({
    origin: config.clientUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.use(express.json({ limit: '5mb' })); // higher limit so base64 product images fit

app.use(config.apiBaseUrl, apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
