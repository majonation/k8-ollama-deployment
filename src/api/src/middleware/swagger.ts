import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LLM API',
      version: '1.0.0',
      description: 'REST API for interacting with LLM models via Ollama',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'API Support',
        url: 'https://example.com',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://llm-api.example.com',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            statusCode: {
              type: 'integer',
              example: 400,
            },
            message: {
              type: 'string',
              example: 'Bad Request',
            },
          },
        },
        CompletionRequest: {
          type: 'object',
          required: ['prompt'],
          properties: {
            prompt: {
              type: 'string',
              example: 'Tell me about artificial intelligence',
            },
            model: {
              type: 'string',
              example: 'llama2',
            },
            temperature: {
              type: 'number',
              example: 0.7,
            },
            top_p: {
              type: 'number',
              example: 0.9,
            },
            top_k: {
              type: 'number',
              example: 40,
            },
            max_tokens: {
              type: 'integer',
              example: 1024,
            },
            system_prompt: {
              type: 'string',
              example: 'You are a helpful AI assistant.',
            },
          },
        },
        CompletionResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            data: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  example: 'Artificial intelligence (AI) refers to...',
                },
                model: {
                  type: 'string',
                  example: 'llama2',
                },
              },
            },
          },
        },
        JsonResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            data: {
              type: 'object',
              example: {
                planets: [
                  {
                    name: 'Earth',
                    type: 'Terrestrial',
                    diameter: 12742,
                    distanceFromSun: 149.6,
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/controllers/*.ts'],
};

const specs = swaggerJsDoc(options);

export const setupSwagger = (app: express.Application): void => {
  if (process.env.ENABLE_SWAGGER === 'true') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    console.log('📚 Swagger documentation available at /api-docs');
  }
}; 