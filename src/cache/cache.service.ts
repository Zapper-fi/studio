import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { isNil } from 'lodash';

import { CacheOptions, CACHE_INSTANCE, CACHE_KEY, CACHE_TTL } from './cache.decorator';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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
          (key: string) => {
            this.registerCache(wrapper.instance, key);
          },
        );
      });
  }

  private extractKey(cacheKey: CacheOptions['key'], args: any[]) {
    return typeof cacheKey === 'function' ? cacheKey(...args) : cacheKey;
  }

  private extractTtl(cacheTtl: CacheOptions['ttl'], args: any[]) {
    if (isNil(cacheTtl)) return 0;
    return typeof cacheTtl === 'function' ? cacheTtl(...args) : cacheTtl;
  }

  private registerCache(instance: any, key: string) {
    const methodRef = instance[key];
    const rawCacheKey: CacheOptions['key'] = this.reflector.get(CACHE_KEY, methodRef);
    const rawCacheTtl: CacheOptions['ttl'] = this.reflector.get(CACHE_TTL, methodRef);
    const cacheInstance: string = this.reflector.get(CACHE_INSTANCE, methodRef);

    // Don't register cache on interval when missing parameters
    if (!rawCacheKey || !isNil(rawCacheTtl) || !cacheInstance) return;

    // Don't register cache on interval when cache conflict

    // Service references
    const cacheManager = this.cacheManager;
    const extractKey = this.extractKey;
    const extractTtl = this.extractTtl;

    // Augment the method to be cached with caching mechanism
    instance[key] = async function (...args: any[]) {
      const cacheKey = extractKey(rawCacheKey, args);
      const cachedValue = await cacheManager.get(cacheKey);

      if (cachedValue) {
        return cachedValue;
      } else {
        const cacheTtl = extractTtl(rawCacheTtl, args);
        const liveData = await methodRef.apply(this, args);
        await cacheManager.set(cacheKey, liveData, { ttl: cacheTtl });
        return liveData;
      }
    };
  }
}
