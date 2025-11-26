import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import studentRoutes from './routes/studentRoutes';
import { logger, errorHandler } from '@university/shared';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'student-service' });
});

app.use('/api/students', studentRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Student Service running on port ${PORT}`);
});

export default app;
