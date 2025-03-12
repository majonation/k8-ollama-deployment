declare module 'swagger-ui-express' {
  import { RequestHandler, Router } from 'express';
  
  export interface SwaggerOptions {
    explorer?: boolean;
    swaggerUrl?: string;
    customCss?: string;
    customJs?: string;
    customfavIcon?: string;
    swaggerUrls?: string[];
    isExplorer?: boolean;
    customSiteTitle?: string;
  }
  
  export function serve(path?: string, options?: object): RequestHandler[];
  export function setup(spec: object, options?: SwaggerOptions, ...files: any[]): RequestHandler;
  export function serveWithOptions(options?: object): RequestHandler[];
  export function generateHTML(spec: object, options?: SwaggerOptions, ...files: any[]): string;
}

declare module 'swagger-jsdoc' {
  interface SwaggerDefinition {
    openapi?: string;
    swagger?: string;
    info: {
      title: string;
      version: string;
      description?: string;
      termsOfService?: string;
      license?: {
        name: string;
        url: string;
      };
      contact?: {
        name?: string;
        url?: string;
        email?: string;
      };
    };
    host?: string;
    basePath?: string;
    schemes?: string[];
    consumes?: string[];
    produces?: string[];
    servers?: Array<{
      url: string;
      description?: string;
    }>;
    components?: object;
  }
  
  interface Options {
    swaggerDefinition: SwaggerDefinition;
    apis: string[];
  }
  
  function swaggerJsdoc(options: Options): object;
  export default swaggerJsdoc;
}

declare module 'express-prom-bundle' {
  import { RequestHandler } from 'express';
  import { Registry } from 'prom-client';
  
  interface PromBundleOptions {
    includeMethod?: boolean;
    includePath?: boolean;
    includeStatusCode?: boolean;
    includeUp?: boolean;
    customLabels?: Record<string, string | number>;
    promClient?: {
      collectDefaultMetrics?: Record<string, any>;
    };
    normalizePath?: (req: any, opts: any) => string;
    urlValueParser?: (req: any, opts: any) => string;
    buckets?: number[];
    transformLabels?: (labels: Record<string, any>, req: any, res: any) => Record<string, any>;
    metricsPath?: string;
    promRegistry?: Registry;
  }
  
  function promBundle(options?: PromBundleOptions): RequestHandler;
  export default promBundle;
}

declare module 'prom-client' {
  export class Registry {
    static merge(registers: Registry[]): Registry;
    static defaultMetrics: {
      metricsList: string[];
      maybeInit(registry: Registry): void;
    };
    
    constructor();
    
    getMetricsAsJSON(): object[];
    getMetricsAsArray(): object[];
    metrics(): string;
    registerMetric(metric: Metric<any>): void;
    clear(): void;
    
    static globalRegistry: Registry;
    
    Counter: typeof Counter;
    Gauge: typeof Gauge;
    Histogram: typeof Histogram;
    Summary: typeof Summary;
  }
  
  export const register: Registry;
  
  export interface Metric<T> {
    name: string;
    help: string;
    labelNames: string[];
    type: string;
  }
  
  export class Counter<T extends string = string> implements Metric<T> {
    constructor(configuration: {
      name: string;
      help: string;
      labelNames?: T[];
    });
    
    name: string;
    help: string;
    labelNames: T[];
    type: string;
    
    inc(labels?: Record<T, string | number>, value?: number): void;
    labels(...labels: string[]): Counter<T>;
    remove(...labels: string[]): void;
    reset(): void;
  }
  
  export class Gauge<T extends string = string> implements Metric<T> {
    constructor(configuration: {
      name: string;
      help: string;
      labelNames?: T[];
    });
    
    name: string;
    help: string;
    labelNames: T[];
    type: string;
    
    inc(labels?: Record<T, string | number>, value?: number): void;
    dec(labels?: Record<T, string | number>, value?: number): void;
    set(labels: Record<T, string | number>, value: number): void;
    setToCurrentTime(labels?: Record<T, string | number>): void;
    startTimer(labels?: Record<T, string | number>): (labels?: Record<T, string | number>) => number;
    labels(...labels: string[]): Gauge<T>;
    remove(...labels: string[]): void;
    reset(): void;
  }
  
  export class Histogram<T extends string = string> implements Metric<T> {
    constructor(configuration: {
      name: string;
      help: string;
      labelNames?: T[];
      buckets?: number[];
    });
    
    name: string;
    help: string;
    labelNames: T[];
    type: string;
    
    observe(labels: Record<T, string | number>, value: number): void;
    startTimer(labels?: Record<T, string | number>): (labels?: Record<T, string | number>) => number;
    labels(...labels: string[]): Histogram<T>;
    remove(...labels: string[]): void;
    reset(): void;
  }
  
  export class Summary<T extends string = string> implements Metric<T> {
    constructor(configuration: {
      name: string;
      help: string;
      labelNames?: T[];
      percentiles?: number[];
      maxAgeSeconds?: number;
      ageBuckets?: number;
    });
    
    name: string;
    help: string;
    labelNames: T[];
    type: string;
    
    observe(labels: Record<T, string | number>, value: number): void;
    startTimer(labels?: Record<T, string | number>): (labels?: Record<T, string | number>) => number;
    labels(...labels: string[]): Summary<T>;
    remove(...labels: string[]): void;
    reset(): void;
  }
}

declare module 'helmet' {
  import { RequestHandler } from 'express';
  
  interface HelmetOptions {
    contentSecurityPolicy?: boolean | object;
    crossOriginEmbedderPolicy?: boolean | object;
    crossOriginOpenerPolicy?: boolean | object;
    crossOriginResourcePolicy?: boolean | object;
    dnsPrefetchControl?: boolean | object;
    expectCt?: boolean | object;
    frameguard?: boolean | object;
    hidePoweredBy?: boolean | object;
    hsts?: boolean | object;
    ieNoOpen?: boolean | object;
    noSniff?: boolean | object;
    originAgentCluster?: boolean;
    permittedCrossDomainPolicies?: boolean | object;
    referrerPolicy?: boolean | object;
    xssFilter?: boolean | object;
  }
  
  function helmet(options?: HelmetOptions): RequestHandler;
  export default helmet;
}

declare module 'morgan' {
  import { RequestHandler } from 'express';
  
  type FormatFn = (tokens: any, req: any, res: any) => string;
  
  interface Options {
    stream?: NodeJS.WritableStream;
    skip?: (req: any, res: any) => boolean;
  }
  
  function morgan(format: string | FormatFn, options?: Options): RequestHandler;
  
  export default morgan;
} 