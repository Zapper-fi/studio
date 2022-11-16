import { applyDecorators, SetMetadata } from '@nestjs/common';
import { Class } from 'type-fest';

export const CACHE_ON_INTERVAL_OPTIONS = 'CACHE_ON_INTERVAL_OPTIONS';

export type CacheOnIntervalOptions = {
  key: string;
  timeout: number;
  failOnMissingData?: boolean;
};

type CacheOnIntervalBuilderOptions = CacheOnIntervalOptions & {
  targetMethod: string;
};

export function CacheOnIntervalBuilder<T>({ targetMethod, ...opts }: CacheOnIntervalBuilderOptions) {
  return (target: Class<T>) => {
    const method = target.prototype[targetMethod];
    if (!method) throw new Error(`Method ${targetMethod} not found!`);

    return CacheOnInterval(opts)(method);
  };
}

export const CacheOnInterval = (options: CacheOnIntervalOptions) => {
  return applyDecorators(SetMetadata(CACHE_ON_INTERVAL_OPTIONS, options));
};
