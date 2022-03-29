import { applyDecorators, SetMetadata } from '@nestjs/common';

export const CACHE_KEY = 'CACHE_KEY';
export const CACHE_TTL = 'CACHE_TTL';
export const CACHE_INSTANCE = 'CACHE_INSTANCE';
export const CACHE_FAIL_ON_MISSING_CACHE = 'CACHE_FAIL_ON_MISSING_CACHE';

type CacheKeyBuilder = (...args: any) => string;
type CacheTtlBuilder = (...args: any) => number;

export type CacheOptions = {
  key: string | CacheKeyBuilder;
  ttl?: number | null | CacheTtlBuilder;
  failOnMissingData?: boolean;
};

export const Cache = (options: CacheOptions) => {
  const { failOnMissingData = false, ttl = null } = options;

  console.log('options', options.key, ttl);
  return applyDecorators(
    SetMetadata(CACHE_KEY, options.key),
    SetMetadata(CACHE_INSTANCE, 'business'),
    SetMetadata(CACHE_TTL, ttl),
    SetMetadata(
      CACHE_FAIL_ON_MISSING_CACHE,
      // Do not throw locally if cached data is missing, try to fetch it
      // to ease development
      process.env.NODE_ENV !== 'production' ? failOnMissingData : false,
    ),
  );
};
