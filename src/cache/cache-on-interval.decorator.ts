import { applyDecorators, SetMetadata } from '@nestjs/common';
import { Class } from 'type-fest';

export const CACHE_ON_INTERVAL_KEY = 'CACHE_ON_INTERVAL_KEY';
export const CACHE_ON_INTERVAL_TIMEOUT = 'CACHE_ON_INTERVAL_TIMEOUT';
export const CACHE_ON_INTERVAL_ELEMENTS_KEY = 'CACHE_ON_INTERVAL_ELEMENTS_KEY';
const CACHE_ON_INTERVAL_INSTANCE = 'CACHE_ON_INTERVAL_INSTANCE';
const CACHE_ON_INTERVAL_FAIL_ON_MISSING_CACHE = 'CACHE_ON_INTERVAL_FAIL_ON_MISSING_CACHE';

export type CacheOnIntervalOptions = {
  key: string;
  timeout: number;
  failOnMissingData?: boolean;
  elementsKey?: (v: any) => string;
};

type CacheOnIntervalBuilderOptions = CacheOnIntervalOptions & {
  targetMethod: string;
};

export function CacheOnIntervalBuilder<T>({
  targetMethod,
  key,
  timeout,
  failOnMissingData,
}: CacheOnIntervalBuilderOptions) {
  return (target: Class<T>) => {
    const method = target.prototype[targetMethod];
    if (!method) throw new Error(`Method ${targetMethod} not found!`);

    return CacheOnInterval({
      key,
      timeout,
      failOnMissingData,
    })(method);
  };
}

export const CacheOnInterval = (options: CacheOnIntervalOptions) => {
  const { failOnMissingData = false } = options;

  return applyDecorators(
    SetMetadata(CACHE_ON_INTERVAL_KEY, options.key),
    SetMetadata(CACHE_ON_INTERVAL_INSTANCE, 'business'),
    SetMetadata(CACHE_ON_INTERVAL_TIMEOUT, options.timeout),
    SetMetadata(
      CACHE_ON_INTERVAL_FAIL_ON_MISSING_CACHE,
      // Do not throw locally if cached data is missing, try to fetch it
      // to ease development
      process.env.NODE_ENV !== 'production' ? failOnMissingData : false,
    ),
  );
};
