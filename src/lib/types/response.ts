export type OKResponseCodes = 200 | 201;
export type ErrorResponseCodes = 400 | 401 | 403 | 404 | 422 | 429 | 500;

export type APIResponse<DataType> = {
  code: OKResponseCodes | ErrorResponseCodes;
  data: DataType;
  message?: string;
};

export type APICollectionResponse<DataType> = {
  code: OKResponseCodes | ErrorResponseCodes;
  count: number;
  data: Array<DataType>;
};
