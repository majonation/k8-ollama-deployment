import axios from 'axios';
import { ApiError } from '../middleware/errorHandler';

// Environment variables
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://ollama:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'llama3:32b';

// Types
export interface GenerationOptions {
  model?: string;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
  system_prompt?: string;
}

export interface GenerationResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export interface JsonValidationResult {
  isValid: boolean;
  data?: any;
  error?: string;
}

/**
 * Service to interact with Ollama API
 */
export class OllamaService {
  private baseUrl: string;
  private defaultModel: string;

  constructor(baseUrl = OLLAMA_URL, defaultModel = DEFAULT_MODEL) {
    this.baseUrl = baseUrl;
    this.defaultModel = defaultModel;
  }

  /**
   * Wraps user prompt with system prompt
   */
  private wrapWithSystemPrompt(prompt: string, systemPrompt?: string): string {
    const defaultSystemPrompt = 
      'You are a helpful AI assistant. Your responses should be accurate, helpful, and safe. ' +
      'When asked to generate content, please format it as valid JSON.';
    
    const finalSystemPrompt = systemPrompt || defaultSystemPrompt;
    
    return `<system>${finalSystemPrompt}</system>\n\n${prompt}`;
  }

  /**
   * Validates if a string is valid JSON
   */
  public validateJson(jsonString: string): JsonValidationResult {
    try {
      // Try to parse the JSON
      const data = JSON.parse(jsonString);
      return { isValid: true, data };
    } catch (error) {
      if (error instanceof Error) {
        return { isValid: false, error: error.message };
      }
      return { isValid: false, error: 'Unknown error parsing JSON' };
    }
  }

  /**
   * Extracts JSON from a text response
   */
  private extractJsonFromText(text: string): JsonValidationResult {
    // Look for JSON-like patterns (between curly braces)
    const jsonRegex = /{[\s\S]*}/;
    const match = text.match(jsonRegex);
    
    if (!match) {
      return { isValid: false, error: 'No JSON object found in response' };
    }
    
    return this.validateJson(match[0]);
  }

  /**
   * Generate text using Ollama API
   */
  public async generateText(
    prompt: string, 
    options: GenerationOptions = {}
  ): Promise<string> {
    try {
      const model = options.model || this.defaultModel;
      const wrappedPrompt = this.wrapWithSystemPrompt(prompt, options.system_prompt);
      
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model,
        prompt: wrappedPrompt,
        stream: false,
        options: {
          temperature: options.temperature || 0.7,
          top_p: options.top_p || 0.9,
          top_k: options.top_k || 40,
          num_predict: options.max_tokens || 1024,
        }
      });
      
      return response.data.response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.status || 500,
          `Ollama API error: ${error.message}`
        );
      }
      throw new ApiError(500, 'Failed to generate text from Ollama');
    }
  }

  /**
   * Generate JSON using Ollama API
   */
  public async generateJson(
    prompt: string,
    options: GenerationOptions = {}
  ): Promise<any> {
    // Add JSON instruction to system prompt
    const jsonSystemPrompt = 
      (options.system_prompt || '') + 
      '\nYou must respond with valid JSON only. No other text before or after the JSON.';
    
    const jsonOptions = {
      ...options,
      system_prompt: jsonSystemPrompt,
      temperature: options.temperature || 0.2, // Lower temperature for more deterministic JSON
    };
    
    // Generate the text
    const response = await this.generateText(prompt, jsonOptions);
    
    // Validate and extract JSON
    const jsonResult = this.extractJsonFromText(response);
    
    if (!jsonResult.isValid) {
      throw new ApiError(422, `Failed to generate valid JSON: ${jsonResult.error}`);
    }
    
    return jsonResult.data;
  }
} 