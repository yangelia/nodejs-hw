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

await connectMongoDB();

// ----- GLOBAL MIDDLEWARE -----
app.use(logger);
app.use(helmet());
app.use(cors());
app.use(express.json());

// ----- ROUTES -----
app.use(notesRoutes);

// ----- 404 -----
app.use(notFoundHandler);

// ----- CELEBRATE VALIDATION ERRORS -----
app.use(errors()); // <-- ДОЛЖНО БЫТЬ ПЕРЕД errorHandler!!!

// ----- GLOBAL ERROR HANDLER -----
app.use(errorHandler);

// ----- START SERVER -----
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
