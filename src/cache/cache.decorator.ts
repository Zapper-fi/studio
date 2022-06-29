import { applyDecorators, SetMetadata } from '@nestjs/common';

export const CACHE_DECORATOR = 'CACHE_DECORATOR';

type CacheKeyBuilder = (...args: any) => string;
type CacheTtlBuilder = (...args: any) => number;

export type CacheOptions = {
  instance?: 'user' | 'business';
  key: string | CacheKeyBuilder;
  /** In seconds */
  ttl?: number | CacheTtlBuilder;
};

export const Cache = ({ key, ttl, instance }: CacheOptions) => {
  return applyDecorators(
    SetMetadata(CACHE_DECORATOR, {
      key,
      ttl,
      instance: instance || 'business',
    }),
  );
};
