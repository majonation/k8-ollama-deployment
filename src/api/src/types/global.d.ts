import { Histogram } from 'prom-client';

declare global {
  var metrics: {
    llmLatencyHistogram: Histogram<string>;
    tokenCountHistogram: Histogram<string>;
  };
  
  namespace NodeJS {
    interface Global {
      metrics: {
        llmLatencyHistogram: Histogram<string>;
        tokenCountHistogram: Histogram<string>;
      };
    }
  }
} 