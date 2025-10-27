import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/v1/auth.routes';
import dashRoutes from './routes/v1/dash.routes';

const app = express();

// ✅ CORS config must allow cookies from frontend origin
app.use(cors({
  origin: process.env.ORIGIN_URL?.replace(/\/$/, '') || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// ✅ Required to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use('/api/v1/auth', authRoutes);

// ✅ Error handler
app.use(errorHandler);
app.use('/api/v1', dashRoutes); 

export default app;
