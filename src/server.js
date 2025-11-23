import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import helmet from 'helmet';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT ?? 3000;

// ===== GLOBAL MIDDLEWARE =====
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(
  pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  }),
);

// ===== ROUTES =====

// Корень
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello, World!' });
});

// GET /notes
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

// GET /notes/:noteId
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

// Тестовая ошибка
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// ===== 404 middleware =====
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    message: err.message,
  });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
