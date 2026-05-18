export type ApiResponse<TResp> = Promise<TResp & { status: number }>;
export type ApiResponseData<TData> = ApiResponse<{ data: TData }>;
export type ApiResponseMessages<TMessages> = ApiResponse<{
  messages: TMessages;
}>;

export interface DefaultListParams {
  page?: number;
  pageSize?: number;
  infiniteScroll?: boolean;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}
