variable "kube_config_path" {
  description = "Path to the kubeconfig file"
  type        = string
  default     = "~/.kube/config"
}

variable "namespace" {
  description = "Kubernetes namespace for the LLM application"
  type        = string
  default     = "llm-system"
}

variable "ollama_image" {
  description = "Docker image for Ollama"
  type        = string
  default     = "ollama/ollama:latest"
}

variable "ollama_model" {
  description = "Ollama model to use"
  type        = string
  default     = "llama3:32b"
}

variable "api_replicas" {
  description = "Number of API service replicas"
  type        = number
  default     = 2
}

variable "ollama_replicas" {
  description = "Number of Ollama service replicas"
  type        = number
  default     = 1
}

variable "api_resource_limits" {
  description = "Resource limits for API service"
  type = object({
    cpu    = string
    memory = string
  })
  default = {
    cpu    = "500m"
    memory = "512Mi"
  }
}

variable "ollama_resource_limits" {
  description = "Resource limits for Ollama service"
  type = object({
    cpu    = string
    memory = string
  })
  default = {
    cpu    = "4"
    memory = "16Gi"
  }
} 