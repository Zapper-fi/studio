import { applyDecorators, SetMetadata } from '@nestjs/common';

export const CACHE_DECORATOR = 'CACHE_DECORATOR';

type CacheKeyBuilder = (...args: any) => string;
type CacheTtlBuilder = (...args: any) => number;

export type CacheOptions = {
  key: string | CacheKeyBuilder;
  /** In seconds */
  ttl?: number | CacheTtlBuilder;
};

export const Cache = ({ key, ttl }: CacheOptions) => {
  return applyDecorators(
    SetMetadata(CACHE_DECORATOR, {
      key,
      ttl,
    }),
  );
};
