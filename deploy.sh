#!/bin/bash
set -e

# Configuration
DOCKER_REGISTRY="your-registry"  # Replace with your Docker registry
API_IMAGE_NAME="llm-api"
API_IMAGE_TAG="latest"
NAMESPACE="llm-system"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Building and deploying LLM API...${NC}"

# Build API Docker image
echo -e "${GREEN}Building API Docker image...${NC}"
cd src/api
docker build -t ${DOCKER_REGISTRY}/${API_IMAGE_NAME}:${API_IMAGE_TAG} .
docker push ${DOCKER_REGISTRY}/${API_IMAGE_NAME}:${API_IMAGE_TAG}
cd ../..

# Apply Terraform
echo -e "${GREEN}Applying Terraform configuration...${NC}"
cd terraform
terraform init
terraform apply -auto-approve
cd ..

# Apply Kubernetes manifests
echo -e "${GREEN}Applying Kubernetes manifests...${NC}"
kubectl apply -f k8s/ollama/
kubectl apply -f k8s/api/

# Wait for deployments to be ready
echo -e "${GREEN}Waiting for deployments to be ready...${NC}"
kubectl rollout status deployment/ollama -n ${NAMESPACE}
kubectl rollout status deployment/llm-api -n ${NAMESPACE}

# Get the Ingress URL
echo -e "${GREEN}Getting Ingress URL...${NC}"
INGRESS_HOST=$(kubectl get ingress llm-api-ingress -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
if [ -z "$INGRESS_HOST" ]; then
  INGRESS_HOST=$(kubectl get ingress llm-api-ingress -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
fi

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${YELLOW}API is available at: http://${INGRESS_HOST}/api/v1/llm${NC}" 