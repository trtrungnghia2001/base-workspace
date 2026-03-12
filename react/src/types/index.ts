export interface ApiResponse<T = unknown> {
  message: string;
  status: boolean;
  statusCode: number;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}
