import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import Cache from 'file-system-cache';

import {
  CacheOnIntervalOptions,
  CACHE_ON_INTERVAL_KEY,
  CACHE_ON_INTERVAL_TIMEOUT,
} from './cache-on-interval.decorator';

@Injectable()
export class CacheOnIntervalService implements OnModuleInit, OnModuleDestroy {
  private readonly intervals: NodeJS.Timer[] = [];
  private readonly registeredCacheKeys: string[] = [];
  private logger = new Logger(CacheOnIntervalService.name);
  private cacheManager = Cache({
    basePath: './.cache', // Optional. Path where cache files are stored (default).
    ns: '@CacheOnInterval', // Optional. A grouping namespace for items.
  });

  constructor(
    @Inject(DiscoveryService) private readonly discoveryService: DiscoveryService,
    @Inject(MetadataScanner) private readonly metadataScanner: MetadataScanner,
    @Inject(Reflector) private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    const instanceWrappers = this.discoveryService.getProviders();
    instanceWrappers
      .filter(wrapper => wrapper.isDependencyTreeStatic() && !!wrapper.instance)
      .forEach(wrapper => {
        this.metadataScanner.scanFromPrototype(
          wrapper.instance,
          Object.getPrototypeOf(wrapper.instance),
          (methodName: string) => {
            this.registerCache(wrapper.instance, methodName);
          },
        );
      });
  }

  onModuleDestroy() {
    this.intervals.forEach(interval => clearInterval(interval));
  }

  private checkCacheConflicts(cacheKey: string) {
    if (this.registeredCacheKeys.includes(cacheKey)) {
      throw new Error(`Cache conflict found for key "${cacheKey}"`);
    }

    this.registeredCacheKeys.push(cacheKey);
  }

  private registerCache(instance: any, methodName: string) {
    const logger = this.logger;
    const methodRef = instance[methodName];
    const cacheKey: CacheOnIntervalOptions['key'] = this.reflector.get(CACHE_ON_INTERVAL_KEY, methodRef);
    const cacheTimeout: CacheOnIntervalOptions['timeout'] = this.reflector.get(CACHE_ON_INTERVAL_TIMEOUT, methodRef);

    // Don't register cache on interval when missing parameters
    if (!cacheKey || !cacheTimeout) return;

    // Don't register cache on cache conflict
    try {
      this.checkCacheConflicts(cacheKey);
    } catch (e) {
      this.logger.error(e.message);
    }

    // Service references
    const cacheManager = this.cacheManager;

    // Augment the method to be cached with caching mechanism
    instance[methodName] = async function () {
      const cachedValue = await cacheManager.get(cacheKey);

      if (cachedValue) {
        return cachedValue;
      } else {
        logger.warn(
          `@CacheOnInterval has no cache primed for ${instance.constructor.name}#${methodName}. Please wait for a few seconds as the cache is primed.`,
        );
      }
    };

    let liveData = methodRef.apply(instance);
    // Duck typing shennanigans
    if (!liveData.then) {
      liveData = new Promise(liveData);
    }
    liveData
      .then(d => {
        return cacheManager.set(cacheKey, d);
      })
      .then(() => {
        logger.log(`Cache ready for for ${instance.constructor.name}#${methodName}`);
      })
      .catch(e => {
        logger.error(`@CacheOnInterval error init for ${instance.constructor.name}#${methodName}`, e);
      });

    // Save the interval
    const interval = setInterval(async () => {
      try {
        const liveData = await methodRef.apply(instance);
        await cacheManager.set(cacheKey, liveData);
      } catch (e) {
        logger.error(`@CacheOnInterval error for ${instance.constructor.name}#${methodName}`, e);
      }
    }, cacheTimeout);
    this.intervals.push(interval);
  }
}
