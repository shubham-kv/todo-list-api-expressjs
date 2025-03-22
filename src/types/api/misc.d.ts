export type Entity = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SuccessResponse<T> = {
  message: string;
} & T;
