import { Router, Request, Response, NextFunction } from 'express';
import { OllamaService, GenerationOptions } from '../services/ollamaService';
import { ApiError } from '../middleware/errorHandler';

// Create router
export const llmRoutes = Router();

// Create Ollama service instance
const ollamaService = new OllamaService();

// Validate request body for completions
const validateCompletionRequest = (req: Request, res: Response, next: NextFunction) => {
  const { prompt } = req.body;
  
  if (!prompt || typeof prompt !== 'string') {
    return next(new ApiError(400, 'Prompt is required and must be a string'));
  }
  
  next();
};

// Text completion endpoint
llmRoutes.post('/completions', validateCompletionRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt } = req.body;
    const options: GenerationOptions = {
      model: req.body.model,
      temperature: req.body.temperature,
      top_p: req.body.top_p,
      top_k: req.body.top_k,
      max_tokens: req.body.max_tokens,
      system_prompt: req.body.system_prompt
    };
    
    const response = await ollamaService.generateText(prompt, options);
    
    res.status(200).json({
      status: 'success',
      data: {
        text: response,
        model: options.model || process.env.OLLAMA_MODEL || 'llama3:32b'
      }
    });
  } catch (error) {
    next(error);
  }
});

// JSON completion endpoint
llmRoutes.post('/json', validateCompletionRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt } = req.body;
    const options: GenerationOptions = {
      model: req.body.model,
      temperature: req.body.temperature,
      top_p: req.body.top_p,
      top_k: req.body.top_k,
      max_tokens: req.body.max_tokens,
      system_prompt: req.body.system_prompt
    };
    
    const jsonResponse = await ollamaService.generateJson(prompt, options);
    
    res.status(200).json({
      status: 'success',
      data: jsonResponse
    });
  } catch (error) {
    next(error);
  }
});

// Validate JSON endpoint
llmRoutes.post('/validate-json', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return next(new ApiError(400, 'Text is required and must be a string'));
    }
    
    const validationResult = ollamaService.validateJson(text);
    
    res.status(200).json({
      status: 'success',
      data: validationResult
    });
  } catch (error) {
    next(error);
  }
});

// Get available models
llmRoutes.get('/models', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real implementation, this would query Ollama for available models
    // For now, we'll return a static response
    res.status(200).json({
      status: 'success',
      data: {
        models: [
          {
            id: 'llama3:32b',
            name: 'Llama 3 32B',
            description: 'Llama 3 32B model from Meta'
          }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
}); 