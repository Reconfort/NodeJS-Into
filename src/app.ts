import 'reflect-metadata';
import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import welcomeRoutes from './routes/welcome.routes';
import usersRoutes from './routes/users.routes';
import { initializeDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { options } from './config/swagger';

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '8080');

const specs = swaggerJsdoc(options);

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:8080',
    'http://127.0.0.1:8080' 
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));


// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/', welcomeRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

// Documentation with custom options
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Authentication API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true
  }
}));

// Error handling middleware (should be last)
app.use(errorHandler);

// Start the server
const startServer = async () => {
  try {
    // Initialize db connection
    await initializeDatabase();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
      console.log(`📚 API Documentation available at http://127.0.0.1:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Run the server
startServer();