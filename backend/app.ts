import express from 'express';
import cors from 'cors';
import { settings } from './config/settings';
import { initDatabase } from './data/database';
import apiRouter from './navigation';
import { handleError } from './utils/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize DB
initDatabase();

// Routes
app.use('/api', apiRouter);

// Home
app.get('/', (_req, res) => {
  res.json({ name: 'Healtheaty API', status: 'ready' });
});

// Error handling middleware (MUST BE LAST)
app.use(handleError);

app.listen(settings.PORT, () => {
  console.log(`🚀 Healtheaty Node.js Backend on port ${settings.PORT}`);
});

export default app;
