import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { llmRoutes } from './controllers/llmController';
import { setupSwagger } from './middleware/swagger';
import { setupMetrics } from './middleware/metrics';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies

// Set up API documentation with Swagger
setupSwagger(app);

// Set up metrics for monitoring
setupMetrics(app);

// Routes
app.use('/api/v1/llm', llmRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
// We need to cast the error handler to 'any' to work around Express type limitations
app.use(errorHandler as any);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Using Ollama URL: ${process.env.OLLAMA_URL}`);
  console.log(`Default model: ${process.env.OLLAMA_MODEL}`);
});

export default app; 