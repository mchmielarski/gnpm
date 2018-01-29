export interface RequestIdMiddlewareOptions {
  uuidVersion?: 'v1' | 'v4';
  headerName?: string;
  setHeader?: boolean;
  attributeName?: string;
}
