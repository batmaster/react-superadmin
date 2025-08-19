export interface DataProviderParams {
  pagination?: {
    page: number;
    perPage: number;
  };
  sort?: {
    field: string;
    order: 'ASC' | 'DESC';
  };
  filter?: Record<string, any>;
  search?: string;
  signal?: AbortSignal;
}

export interface ListResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface GetOneParams {
  id: string | number;
  signal?: AbortSignal;
}

export interface GetManyParams {
  ids: (string | number)[];
  signal?: AbortSignal;
}

export interface GetManyReferenceParams extends DataProviderParams {
  target: string;
  id: string | number;
}

export interface CreateParams<T = any> {
  data: T;
}

export interface UpdateParams<T = any> {
  id: string | number;
  data: Partial<T>;
  previousData?: T;
}

export interface UpdateManyParams<T = any> {
  ids: (string | number)[];
  data: Partial<T>;
}

export interface DeleteParams {
  id: string | number;
  previousData?: any;
}

export interface DeleteManyParams {
  ids: (string | number)[];
}

export interface DataProvider {
  getList: <T = any>(
    resource: string,
    params: DataProviderParams
  ) => Promise<ListResponse<T>>;
  getOne: <T = any>(
    resource: string,
    params: GetOneParams
  ) => Promise<{ data: T }>;
  getMany: <T = any>(
    resource: string,
    params: GetManyParams
  ) => Promise<{ data: T[] }>;
  getManyReference: <T = any>(
    resource: string,
    params: GetManyReferenceParams
  ) => Promise<ListResponse<T>>;
  create: <T = any>(
    resource: string,
    params: CreateParams<T>
  ) => Promise<{ data: T }>;
  update: <T = any>(
    resource: string,
    params: UpdateParams<T>
  ) => Promise<{ data: T }>;
  updateMany: <T = any>(
    resource: string,
    params: UpdateManyParams<T>
  ) => Promise<{ data: (string | number)[] }>;
  delete: <T = any>(
    resource: string,
    params: DeleteParams
  ) => Promise<{ data: T }>;
  deleteMany: <T = any>(
    resource: string,
    params: DeleteManyParams
  ) => Promise<{ data: (string | number)[] }>;
}
