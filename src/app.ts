import 'reflect-metadata';
import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import { initializeDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '8080');

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Error handling middleware
app.use(errorHandler);

// Start the server
const startServer = async () => {
    try {
      // Initialize db connection
      await initializeDatabase();
      
      // Start Express server
      app.listen(PORT, () => {
        console.log(`Express server is running on http://127.0.0.1:${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };
  
  // Run the server
  startServer();