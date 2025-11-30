import express from 'express';
import dotenv from 'dotenv';
import courseRoutes from './routes/courseRoutes';
import { logger, errorHandler } from '@university/shared';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'course-service' });
});

app.use('/api/courses', courseRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Course Service running on port ${PORT}`);
});

export default app;
