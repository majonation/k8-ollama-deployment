# Kubernetes LLM Project

This project deploys Llama models using Ollama on Kubernetes infrastructure provisioned with Terraform. It exposes a REST API interface built with TypeScript.

## Project Structure

- `terraform/` - Terraform configuration for infrastructure provisioning
- `k8s/` - Kubernetes manifests
  - `ollama/` - Ollama deployment configuration
  - `api/` - API service deployment configuration
- `src/` - Source code
  - `api/` - TypeScript REST API service
- `docker-compose.yml` - Local development configuration

## Features

- Hosts Llama models using Ollama
- REST API for interacting with the LLM
- System prompt wrapping for user inputs
- JSON output validation
- Ingress for load balancing
- Infrastructure as Code with Terraform
- Local development environment with Docker Compose

## Local Development

### Prerequisites

- Docker and Docker Compose
- Node.js >= 18 (optional, for local development without Docker)

### Running Locally with Docker Compose

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Start the services:

   ```bash
   docker-compose up -d
   ```

   This will:

   - Start Ollama service and automatically download the Llama 2 model
   - Start the API service in development mode with hot-reloading

3. Check the services:

   ```bash
   # Check if services are running
   docker-compose ps

   # View logs
   docker-compose logs -f
   ```

4. Access the API:

   - API endpoint: http://localhost:3000/api/v1/llm
   - Health check: http://localhost:3000/health
   - Swagger UI: http://localhost:3000/api-docs

5. Test the API:

   ```bash
   # Example: Generate text
   curl -X POST http://localhost:3000/api/v1/llm/completions \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Tell me about AI", "temperature": 0.7}'
   ```

6. Stop the services:
   ```bash
   docker-compose down
   ```

### Development Workflow

1. The API service runs in development mode with hot-reloading
2. Any changes to the TypeScript code will automatically restart the service
3. Logs are available via `docker-compose logs -f api`
4. The Ollama service persists models in a Docker volume

## Cloud Deployment

### Prerequisites

- Terraform >= 1.0.0
- Kubernetes cluster
- kubectl
- Docker registry access

### Deployment Steps

1. Update Docker registry in `deploy.sh`:

   ```bash
   DOCKER_REGISTRY="your-registry"
   ```

2. Set up infrastructure with Terraform:

   ```bash
   cd terraform
   terraform init
   terraform apply
   ```

3. Deploy to Kubernetes:
   ```bash
   ./deploy.sh
   ```

## Architecture

The system consists of:

1. Ollama service running Llama models
2. TypeScript REST API that:
   - Wraps user prompts with system prompts
   - Validates JSON output
   - Provides a clean interface for clients
3. Kubernetes Ingress for load balancing (cloud deployment)
4. Infrastructure provisioned via Terraform (cloud deployment)

## API Documentation

See [API Documentation](src/api/README.md) for detailed endpoint information.

## Configuration

### Environment Variables

- `OLLAMA_URL` - Ollama service URL (default: http://ollama:11434)
- `OLLAMA_MODEL` - Default model to use (default: llama2 for local, llama3:32b for cloud)
- `PORT` - API service port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level (debug/info/warn/error)

### Model Configuration

- Local development uses the smaller Llama 2 model for faster testing
- Cloud deployment uses Llama 3 32B for production use
- Models are automatically downloaded on first use

## Troubleshooting

1. If the Ollama service is slow to start:

   ```bash
   # Check Ollama logs
   docker-compose logs ollama
   ```

2. If the API service fails to connect to Ollama:

   ```bash
   # Restart the API service
   docker-compose restart api
   ```

3. To reset the environment:
   ```bash
   # Remove containers and volumes
   docker-compose down -v
   ```
