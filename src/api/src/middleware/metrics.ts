import express from 'express';
import promBundle from 'express-prom-bundle';
import { register } from 'prom-client';

// Define a proper interface for the global metrics object
declare global {
  var metrics: {
    llmLatencyHistogram: any;
    tokenCountHistogram: any;
  };
}

export const setupMetrics = (app: express.Application): void => {
  if (process.env.ENABLE_METRICS === 'true') {
    // Define the prometheus middleware
    const metricsMiddleware = promBundle({
      includeMethod: true,
      includePath: true,
      includeStatusCode: true,
      includeUp: true,
      customLabels: { project: 'llm-api' },
      promClient: { collectDefaultMetrics: {} },
    });

    // Add the prometheus middleware to express
    app.use(metricsMiddleware);
    
    // Add a custom metric for LLM response time
    const llmLatencyHistogram = new register.Histogram({
      name: 'llm_response_time_seconds',
      help: 'Response time of LLM queries in seconds',
      labelNames: ['model', 'endpoint'],
      buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60]
    });

    // Add a custom metric for token counts
    const tokenCountHistogram = new register.Histogram({
      name: 'llm_token_count',
      help: 'Token count of LLM queries',
      labelNames: ['model', 'type'],
      buckets: [10, 50, 100, 500, 1000, 2000, 5000]
    });

    // Add custom metrics to global scope for use in the controller
    global.metrics = {
      llmLatencyHistogram,
      tokenCountHistogram
    };

    console.log('📊 Prometheus metrics available at /metrics');
  }
}; 