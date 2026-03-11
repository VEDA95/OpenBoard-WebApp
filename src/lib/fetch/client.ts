import type { DefaultRequestOptions, DefaultRequestOptionArgument, RequestOptions, RequestInterceptorCallback, ResponseInterceptorCallback } from '@appTypes/fetch';

export const API_BASE = 'http://localhost:8080';

export class Interceptor<CallbackType extends Function, ArgsType> {
  private callbacks: Set<CallbackType>;

  constructor() {
    this.callbacks = new Set<CallbackType>();
  }

  public push(func: CallbackType): void {
    this.callbacks.add(func);
  }

  public remove(func: CallbackType): void {
    this.callbacks.delete(func);
  }

  public clear(): void {
    this.callbacks.clear();
  }

  public get size(): number {
    return this.callbacks.size;
  }

  public async run<DataType>(...args: Array<ArgsType>): Promise<DataType | null> {
    let result: DataType | null = null;

    if (this.callbacks.size === 0) return result;

    for (const callback of this.callbacks) {
      result = await callback(...args);
    }

    return result as DataType;
  }
}

export class Fetcher {
  private defaultOptions?: DefaultRequestOptions;
  private prefix?: string;
  private abortController: AbortController;
  public interceptors: {
    request: Interceptor<RequestInterceptorCallback, string | RequestInit>;
    response: Interceptor<ResponseInterceptorCallback, string | Response | RequestInit>;
  };

  constructor(options?: DefaultRequestOptionArgument) {
    if (options?.prefix != null && options?.prefix.length > 0) {
      this.prefix = options?.prefix;
      let defaultsOptions: DefaultRequestOptionArgument = { ...options };
      delete defaultsOptions.prefix;
      this.defaultOptions = defaultsOptions;
    }

    this.abortController = new AbortController();
    this.interceptors = {
      request: new Interceptor<RequestInterceptorCallback, string | RequestInit>(),
      response: new Interceptor<ResponseInterceptorCallback, string | Response | RequestInit>()
    };
  }

  private async execute(method: string, url: string, options?: RequestOptions): Promise<Response> {
    const requestUrl: string = this.prefix != null ? `${this.prefix}${url}` : url;
    let payload: RequestInit = {
      method,
      signal: this.abortController.signal,
    };

    if (this.defaultOptions != null) {
      payload = { ...payload, ...this.defaultOptions };
    }

    if (options != null) {
      payload = { ...payload, ...options };
    }

    const result = await this.interceptors.request.run<RequestInit>(requestUrl, payload);
    if (result != null) payload = result;
    let response: Response = await fetch(requestUrl, payload);
    const secondResult = await this.interceptors.response.run<Response>(response, requestUrl, payload);
    if (secondResult) response = secondResult;

    return response;
  }

  public async get(url: string, options?: RequestOptions): Promise<Response> {
    return this.execute('GET', url, options);
  }

  public async post(url: string, options?: RequestOptions): Promise<Response> {
    return this.execute('POST', url, options);
  }

  public async patch(url: string, options?: RequestOptions): Promise<Response> {
    return this.execute('PATCH', url, options);
  }

  public async put(url: string, options?: RequestOptions): Promise<Response> {
    return this.execute('PUT', url, options);
  }

  public async delete(url: string, options?: RequestOptions): Promise<Response> {
    return this.execute('DELETE', url, options);
  }

  public cancel(message?: string): void {
    this.abortController.abort(message);
    this.abortController = new AbortController();
  }
}

// --- Instances ---

// For unauthenticated requests (login, register, public settings, etc.)
export const publicClient = new Fetcher({ prefix: API_BASE });

// For authenticated requests — includes session refresh on 401
export const apiClient = new Fetcher({
  prefix: API_BASE,
  credentials: 'include',
});

let refreshPromise: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'session' }),
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    refreshPromise = null;
  }
}

apiClient.interceptors.response.push(async (response: Response, url: string, options: RequestInit): Promise<Response> => {
  if (response.status !== 401) {
    return response;
  }

  // Only attempt refresh/redirect in the browser
  if (typeof window === 'undefined') {
    return response;
  }

  // Deduplicate concurrent refresh attempts
  if (!refreshPromise) {
    refreshPromise = refreshSession();
  }

  const refreshed = await refreshPromise;

  if (!refreshed) {
    window.location.href = '/auth/login';
    return response;
  }

  // Retry the original request with fresh session
  return fetch(url, options);
});
