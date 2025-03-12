#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

usage() {
  echo -e "${BLUE}Usage:${NC}"
  echo -e "  ./model-manager.sh <command> [options]"
  echo ""
  echo -e "${BLUE}Commands:${NC}"
  echo -e "  start <model>    Start the development environment with a specific model"
  echo -e "  import <file>    Import a custom model definition from a file"
  echo -e "  create           Create a new model definition interactively"
  echo -e "  list             List available models"
  echo -e "  monitor          Start monitoring dashboard"
  echo ""
  echo -e "${BLUE}Examples:${NC}"
  echo -e "  ./model-manager.sh start llama2"
  echo -e "  ./model-manager.sh start codellama"
  echo -e "  ./model-manager.sh start mistral"
  echo -e "  ./model-manager.sh start llama3.2"
  echo -e "  ./model-manager.sh import ./my-custom-model"
  echo -e "  ./model-manager.sh create"
  echo -e "  ./model-manager.sh list"
  echo -e "  ./model-manager.sh monitor"
}

start_model() {
  if [ -z "$1" ]; then
    echo -e "${RED}Error: Model name is required${NC}"
    usage
    exit 1
  fi

  MODEL=$1
  echo -e "${YELLOW}Starting development environment with model: ${MODEL}${NC}"
  
  case $MODEL in
    llama2)
      docker-compose --profile llama2 up -d
      ;;
    codellama)
      docker-compose --profile codellama up -d
      ;;
    mistral)
      docker-compose --profile mistral up -d
      ;;
    llama3.2)
      # First check if the model exists
      if [ ! -f "./models/llama3.2" ]; then
        echo -e "${RED}Model llama3.2 not found. Creating it...${NC}"
        # Create the model file
        cat > ./models/llama3.2 << EOF
FROM llama2

# Use specific parameters for the model
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER num_ctx 4096

# Add a system prompt that will be used by default
SYSTEM You are a helpful AI assistant powered by Llama 3. You provide accurate, helpful, and safe responses.
EOF
      fi
      
      # Start with the llama2 profile (we'll use llama2 and create llama3.2 from it)
      docker-compose --profile llama2 up -d
      
      # Wait for Ollama to be ready
      echo -e "${YELLOW}Waiting for Ollama to be ready...${NC}"
      sleep 10
      
      # Create the custom model
      echo -e "${YELLOW}Creating llama3.2 model...${NC}"
      docker-compose exec ollama-llama2 ollama create llama3.2 -f /models/llama3.2
      ;;
    *)
      # Check if it's a custom model
      if [ -f "./models/$MODEL" ]; then
        # Start with the llama2 profile as base
        docker-compose --profile llama2 up -d
        
        # Wait for Ollama to be ready
        echo -e "${YELLOW}Waiting for Ollama to be ready...${NC}"
        sleep 10
        
        # Create the custom model
        echo -e "${YELLOW}Creating custom model: ${MODEL}...${NC}"
        docker-compose exec ollama-llama2 ollama create "$MODEL" -f "/models/$MODEL"
      else
        echo -e "${RED}Error: Unknown model ${MODEL}${NC}"
        echo -e "${YELLOW}Available models: llama2, codellama, mistral, llama3.2, or custom models in ./models directory${NC}"
        exit 1
      fi
      ;;
  esac
  
  echo -e "${GREEN}Services started successfully!${NC}"
  echo -e "${BLUE}API is available at: http://localhost:3000${NC}"
  echo -e "${BLUE}API Documentation: http://localhost:3000/api-docs${NC}"
  echo -e "${BLUE}Ollama is available at: http://localhost:11434${NC}"
}

import_model() {
  if [ -z "$1" ]; then
    echo -e "${RED}Error: Model file path is required${NC}"
    usage
    exit 1
  fi

  FILE=$1
  FILENAME=$(basename "$FILE")
  
  if [ ! -f "$FILE" ]; then
    echo -e "${RED}Error: File not found: $FILE${NC}"
    exit 1
  fi
  
  echo -e "${YELLOW}Importing model from $FILE to ./models/$FILENAME${NC}"
  cp "$FILE" "./models/$FILENAME"
  
  echo -e "${GREEN}Model imported successfully!${NC}"
  echo -e "${BLUE}Start it with: ./model-manager.sh start $FILENAME${NC}"
}

create_model() {
  echo -e "${YELLOW}Creating a new model definition interactively${NC}"
  
  # Get model name
  read -p "Enter model name: " MODEL_NAME
  
  if [ -z "$MODEL_NAME" ]; then
    echo -e "${RED}Error: Model name cannot be empty${NC}"
    exit 1
  fi
  
  if [ -f "./models/$MODEL_NAME" ]; then
    echo -e "${RED}Error: Model $MODEL_NAME already exists${NC}"
    exit 1
  fi
  
  # Get base model
  echo "Select base model:"
  echo "1) llama2"
  echo "2) codellama"
  echo "3) mistral"
  read -p "Enter selection (1-3): " BASE_MODEL_SELECTION
  
  case $BASE_MODEL_SELECTION in
    1) BASE_MODEL="llama2" ;;
    2) BASE_MODEL="codellama" ;;
    3) BASE_MODEL="mistral" ;;
    *) 
      echo -e "${RED}Error: Invalid selection${NC}"
      exit 1
      ;;
  esac
  
  # Get temperature
  read -p "Temperature (0.0-1.0, default: 0.7): " TEMPERATURE
  TEMPERATURE=${TEMPERATURE:-0.7}
  
  # Get system prompt
  read -p "System prompt: " SYSTEM_PROMPT
  SYSTEM_PROMPT=${SYSTEM_PROMPT:-"You are a helpful AI assistant."}
  
  # Create the model file
  cat > "./models/$MODEL_NAME" << EOF
FROM $BASE_MODEL

# Use specific parameters for the model
PARAMETER temperature $TEMPERATURE
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER num_ctx 4096

# Add a system prompt that will be used by default
SYSTEM $SYSTEM_PROMPT
EOF
  
  echo -e "${GREEN}Model $MODEL_NAME created successfully!${NC}"
  echo -e "${BLUE}Start it with: ./model-manager.sh start $MODEL_NAME${NC}"
}

list_models() {
  echo -e "${YELLOW}Available models:${NC}"
  
  echo -e "${BLUE}Built-in models:${NC}"
  echo "- llama2"
  echo "- codellama"
  echo "- mistral"
  
  echo -e "${BLUE}Custom models:${NC}"
  if [ -d "./models" ] && [ "$(ls -A ./models 2>/dev/null)" ]; then
    ls -1 ./models | while read model; do
      echo "- $model"
    done
  else
    echo "No custom models found"
  fi
}

start_monitoring() {
  echo -e "${YELLOW}Starting monitoring dashboard${NC}"
  docker-compose --profile monitoring up -d
  echo -e "${GREEN}Monitoring dashboard started successfully!${NC}"
  echo -e "${BLUE}Prometheus: http://localhost:9090${NC}"
  echo -e "${BLUE}Grafana: http://localhost:3001${NC}"
  echo -e "${BLUE}Grafana credentials: admin/admin${NC}"
}

# Main
if [ $# -eq 0 ]; then
  usage
  exit 1
fi

COMMAND=$1
shift

case $COMMAND in
  start)
    start_model "$1"
    ;;
  import)
    import_model "$1"
    ;;
  create)
    create_model
    ;;
  list)
    list_models
    ;;
  monitor)
    start_monitoring
    ;;
  *)
    echo -e "${RED}Error: Unknown command: $COMMAND${NC}"
    usage
    exit 1
    ;;
esac 