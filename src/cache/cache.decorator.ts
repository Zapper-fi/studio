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

export type CacheOptions = {
  key: string | CacheKeyBuilder;
  instance?: 'user' | 'business';
  ttl?: number | CacheTtlBuilder; // seconds
  localTtl?: number | CacheTtlBuilder; // seconds
  deserializeInto?: DeserializeInto;
  cacheNull?: boolean;
};

export const Cache = (options: CacheOptions) => {
  const { key, ttl, instance, localTtl, deserializeInto, cacheNull } = options;

  return applyDecorators(
    SetMetadata(CACHE_KEY, key),
    SetMetadata(CACHE_INSTANCE, instance),
    SetMetadata(CACHE_TTL, ttl),
    SetMetadata(CACHE_LOCAL_TTL, localTtl),
    SetMetadata(CACHE_DESERIALIZE_INTO, deserializeInto),
    SetMetadata(CACHE_SHOULD_CACHE_NULL, cacheNull),
  );
};
