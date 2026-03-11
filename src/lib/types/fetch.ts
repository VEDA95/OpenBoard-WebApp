export type RequestOptions = Omit<RequestInit, 'method' | 'signal'>;
export type DefaultRequestOptions = Omit<RequestInit, 'body' | 'headers' | 'method' | 'signal'>;
export type DefaultRequestOptionArgument = DefaultRequestOptions & { prefix?: string; };

export type RequestInterceptorCallback = (url: string, options: RequestInit) => RequestInit | Promise<RequestInit>;
export type ResponseInterceptorCallback = (response: Response, url: string, options: RequestInit) => Response | Promise<Response>;
