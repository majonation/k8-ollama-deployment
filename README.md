# Kubernetes LLM Project

This project deploys Llama 3 32B using Ollama on Kubernetes infrastructure provisioned with Terraform. It exposes a REST API interface built with TypeScript.

## Project Structure

- `terraform/` - Terraform configuration for infrastructure provisioning
- `k8s/` - Kubernetes manifests
  - `ollama/` - Ollama deployment configuration
  - `api/` - API service deployment configuration
- `src/` - Source code
  - `api/` - TypeScript REST API service

## Features

- Hosts Llama 3 32B model using Ollama
- REST API for interacting with the LLM
- System prompt wrapping for user inputs
- JSON output validation
- Ingress for load balancing
- Infrastructure as Code with Terraform

## Getting Started

### Prerequisites

- Terraform >= 1.0.0
- Kubernetes cluster
- kubectl
- Node.js >= 18
- Docker

### Deployment

1. Set up infrastructure with Terraform:

   ```
   cd terraform
   terraform init
   terraform apply
   ```

2. Deploy Kubernetes resources:

   ```
   kubectl apply -f k8s/ollama/
   kubectl apply -f k8s/api/
   ```

3. Access the API:
   The API will be available at the Ingress endpoint configured in your Kubernetes cluster.

## Architecture

The system consists of:

1. Ollama service running Llama 3 32B
2. TypeScript REST API that:
   - Wraps user prompts with system prompts
   - Validates JSON output
   - Provides a clean interface for clients
3. Kubernetes Ingress for load balancing
4. Infrastructure provisioned via Terraform
