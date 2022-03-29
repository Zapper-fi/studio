import { applyDecorators, SetMetadata } from '@nestjs/common';

export const CACHE_KEY = 'CACHE_KEY';
export const CACHE_TTL = 'CACHE_TTL';
export const CACHE_INSTANCE = 'CACHE_INSTANCE';
const CACHE_FAIL_ON_MISSING_CACHE = 'CACHE_FAIL_ON_MISSING_CACHE';

type CacheKeyBuilder = (...args: any) => string;
type CacheTtlBuilder = (...args: any) => number;

export type CacheOptions = {
  key: string | CacheKeyBuilder;
  ttl?: number | null | CacheTtlBuilder;
  instance?: 'business' | 'user';
  failOnMissingData?: boolean;
};

export const Cache = (options: CacheOptions) => {
  const { failOnMissingData = false, ttl = null, instance = 'business' } = options;

  return applyDecorators(
    SetMetadata(CACHE_KEY, options.key),
    SetMetadata(CACHE_INSTANCE, instance),
    SetMetadata(CACHE_TTL, ttl),
    SetMetadata(
      CACHE_FAIL_ON_MISSING_CACHE,
      // Do not throw locally if cached data is missing, try to fetch it
      // to ease development
      process.env.NODE_ENV !== 'production' ? failOnMissingData : false,
    ),
  );
};
