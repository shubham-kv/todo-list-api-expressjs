export type Entity = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SuccessResponse<T> = {
  message: string;
} & T;

export type PaginatedResponse<T> = {
  data: T[]
  page: number
  limit: number
  total: number
}
