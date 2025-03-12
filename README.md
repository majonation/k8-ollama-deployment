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
- `docker-compose.override.yml` - Additional configurations for local development
- `models/` - Custom model definitions
- `monitoring/` - Monitoring configurations
- `model-manager.sh` - Script for managing models and local development

## Features

- Hosts Llama models using Ollama
- REST API for interacting with the LLM
- System prompt wrapping for user inputs
- JSON output validation
- Ingress for load balancing
- Infrastructure as Code with Terraform
- Local development environment with Docker Compose
- Support for multiple LLM models (Llama2, CodeLlama, Mistral, custom models)
- Monitoring with Prometheus and Grafana
- Swagger/OpenAPI documentation

## Local Development

### Prerequisites

- Docker and Docker Compose
- Node.js >= 18 (optional, for local development without Docker)

### Quick Start

The easiest way to get started is to use the model management script:

```bash
# List available models
./model-manager.sh list

# Start with Llama2 model (lightweight)
./model-manager.sh start llama2

# Start with CodeLlama model
./model-manager.sh start codellama

# Start with Mistral model
./model-manager.sh start mistral

# Start with Llama 3.2 model
./model-manager.sh start llama3.2
```

### Custom Models

You can create and manage custom models easily:

```bash
# Create a new model interactively
./model-manager.sh create

# Import a model definition
./model-manager.sh import ./path/to/model-definition

# Use a custom model
./model-manager.sh start my-custom-model
```

### Running with Docker Compose Manually

If you prefer to use Docker Compose directly:

```bash
# Start the basic setup
docker-compose up -d

# Start with specific model profile
docker-compose --profile llama2 up -d
docker-compose --profile codellama up -d
docker-compose --profile mistral up -d

# Start monitoring tools
docker-compose --profile monitoring up -d
```

### Monitoring

The project includes Prometheus and Grafana for monitoring:

```bash
# Start monitoring dashboard
./model-manager.sh monitor
```

Then access:

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin)

### API Documentation

The API includes Swagger documentation:

- Swagger UI: http://localhost:3000/api-docs

### Testing the API

```bash
# Example: Generate text
curl -X POST http://localhost:3000/api/v1/llm/completions \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Tell me about AI", "temperature": 0.7}'

# Example: Generate JSON
curl -X POST http://localhost:3000/api/v1/llm/json \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Generate a JSON object with information about 3 planets", "temperature": 0.2}'
```

### Development Workflow

1. The API service runs in development mode with hot-reloading
2. Any changes to the TypeScript code will automatically restart the service
3. Logs are available via `docker-compose logs -f api`
4. The Ollama service persists models in Docker volumes

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
5. Monitoring with Prometheus and Grafana (optional)

## API Documentation

See [API Documentation](src/api/README.md) for detailed endpoint information.

## Configuration

### Environment Variables

- `OLLAMA_URL` - Ollama service URL (default: http://ollama:11434)
- `OLLAMA_MODEL` - Default model to use (default: llama2 for local, llama3:32b for cloud)
- `PORT` - API service port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level (debug/info/warn/error)
- `ENABLE_SWAGGER` - Enable Swagger UI (default: true in development)
- `ENABLE_METRICS` - Enable Prometheus metrics (default: true in development)

### Model Configuration

- Local development uses the smaller Llama 2 model for faster testing
- Cloud deployment uses Llama 3 32B for production use
- Models are automatically downloaded on first use
- Custom models can be defined in the `models/` directory

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

4. If you encounter issues with a specific model:

   ```bash
   # List running containers
   docker-compose ps

   # Check logs for a specific service
   docker-compose logs ollama-llama2
   ```
