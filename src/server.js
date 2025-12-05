import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectMongoDB } from './db/connectMongoDB.js';

import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import userRoutes from './routes/userRoutes.js';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { errors } from 'celebrate';

const app = express();
const PORT = process.env.PORT ?? 3000;

await connectMongoDB();

app.use(logger);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// health-check / корневой маршрут
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

//роуты API
app.use(authRoutes);
app.use(notesRoutes);
app.use(userRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
