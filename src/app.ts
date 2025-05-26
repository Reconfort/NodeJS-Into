import 'reflect-metadata';
import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import welcomeRoutes from './routes/welcome.routes';
import usersRoutes from './routes/users.routes';
import { initializeDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '8080');

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', welcomeRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

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