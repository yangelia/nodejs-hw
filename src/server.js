import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectMongoDB } from './db/connectMongoDB.js';
import notesRoutes from './routes/notesRoutes.js';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import { errors } from 'celebrate';

const app = express();
const PORT = process.env.PORT ?? 3000;

// connect to DB BEFORE server start
await connectMongoDB();

app.use(logger);
app.use(helmet());
app.use(cors());
app.use(express.json());

// ROUTES
app.use('/notes', notesRoutes);

// 404
app.use(notFoundHandler);

// celebrate errors FIRST
app.use(errors());

// global error handler LAST
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
