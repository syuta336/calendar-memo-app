import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // 許可するヘッダー
  })
);

app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Hello, Express with TypeScript!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
