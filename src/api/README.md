# LLM API Service

This is a TypeScript REST API service that interacts with Ollama to provide LLM capabilities.

## Features

- Text completions with Llama 3 32B
- JSON output generation and validation
- System prompt wrapping for user inputs
- Error handling and validation

## API Endpoints

### Text Completions

```
POST /api/v1/llm/completions
```

Request body:

```json
{
  "prompt": "Tell me about artificial intelligence",
  "model": "llama3:32b",
  "temperature": 0.7,
  "top_p": 0.9,
  "top_k": 40,
  "max_tokens": 1024,
  "system_prompt": "You are a helpful AI assistant."
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "text": "Artificial intelligence (AI) refers to...",
    "model": "llama3:32b"
  }
}
```

### JSON Generation

```
POST /api/v1/llm/json
```

Request body:

```json
{
  "prompt": "Generate a JSON object with information about 3 planets",
  "model": "llama3:32b",
  "temperature": 0.2,
  "system_prompt": "You are a helpful AI assistant that provides accurate information."
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "planets": [
      {
        "name": "Earth",
        "type": "Terrestrial",
        "diameter": 12742,
        "distanceFromSun": 149.6
      },
      {
        "name": "Jupiter",
        "type": "Gas Giant",
        "diameter": 139820,
        "distanceFromSun": 778.5
      },
      {
        "name": "Mars",
        "type": "Terrestrial",
        "diameter": 6779,
        "distanceFromSun": 227.9
      }
    ]
  }
}
```

### JSON Validation

```
POST /api/v1/llm/validate-json
```

Request body:

```json
{
  "text": "{\"name\": \"John\", \"age\": 30}"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "isValid": true,
    "data": {
      "name": "John",
      "age": 30
    }
  }
}
```

### Available Models

```
GET /api/v1/llm/models
```

Response:

```json
{
  "status": "success",
  "data": {
    "models": [
      {
        "id": "llama3:32b",
        "name": "Llama 3 32B",
        "description": "Llama 3 32B model from Meta"
      }
    ]
  }
}
```

## Development

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example`

3. Run in development mode:

   ```
   npm run dev
   ```

4. Build for production:

   ```
   npm run build
   ```

5. Run in production mode:
   ```
   npm start
   ```

## Docker

Build the Docker image:

```
docker build -t llm-api:latest .
```

Run the Docker container:

```
docker run -p 3000:3000 --env-file .env llm-api:latest
```
