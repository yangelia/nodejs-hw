import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import helmet from 'helmet';

import { connectMongoDB } from './db/connectMongoDB.js';
import notesRoutes from './routes/notesRoutes.js';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

await connectMongoDB();

app.use(logger);
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(notesRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// temp comment to trigger rebuild
