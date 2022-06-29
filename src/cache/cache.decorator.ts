import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

export const CACHE_KEY = 'CACHE_KEY';
export const CACHE_INSTANCE = 'CACHE_INSTANCE';
export const CACHE_TTL = 'CACHE_TTL';
export const CACHE_LOCAL_TTL = 'CACHE_LOCAL_TTL';
export const CACHE_FORCE_UPDATE = 'CACHE_FORCE_UPDATE';
export const CACHE_DESERIALIZE_INTO = 'CACHE_DESERIALIZE_INTO';
export const CACHE_SHOULD_CACHE_NULL = 'CACHE_SHOULD_CACHE_NULL';

type DeserializeIntoArray<T = unknown> = [ClassConstructor<T>];
type DeserializeInto<T = unknown> = DeserializeIntoArray<T> | ClassConstructor<T>;

type CacheKeyBuilder = (...args: any) => string;
type CacheTtlBuilder = (...args: any) => number;
type CacheForceUpdateBuilder = (...args: any) => boolean;

export type CacheOptions = {
  instance?: 'user' | 'business';
  key: string | CacheKeyBuilder;
  /** In seconds */
  ttl?: number | null | CacheTtlBuilder;
  /** In seconds */
  localTtl?: number | null | CacheTtlBuilder;
  forceUpdate?: boolean | CacheForceUpdateBuilder;
  deserializeInto?: DeserializeInto;
  cacheNull?: boolean;
};

export const Cache = (options: CacheOptions) => {
  const {
    ttl = null,
    instance = 'business',
    localTtl = null,
    forceUpdate = false,
    deserializeInto = undefined,
    cacheNull = false,
  } = options;

  return applyDecorators(
    SetMetadata(CACHE_KEY, options.key),
    SetMetadata(CACHE_INSTANCE, instance),
    SetMetadata(CACHE_TTL, ttl),
    SetMetadata(CACHE_LOCAL_TTL, localTtl),
    SetMetadata(CACHE_FORCE_UPDATE, forceUpdate),
    SetMetadata(CACHE_DESERIALIZE_INTO, deserializeInto),
    SetMetadata(CACHE_SHOULD_CACHE_NULL, cacheNull),
  );
};
