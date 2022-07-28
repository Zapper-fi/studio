import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import Cache from 'file-system-cache';

import { CacheOptions, CACHE_DECORATOR } from './cache.decorator';

@Injectable()
export class CacheService implements OnModuleInit {
  private logger = new Logger(CacheService.name);
  private cacheManager = Cache({
    basePath: './.cache',
    ns: '@Cache',
  });

  constructor(
    @Inject(DiscoveryService) private readonly discoveryService: DiscoveryService,
    @Inject(MetadataScanner) private readonly metadataScanner: MetadataScanner,
    @Inject(Reflector) private readonly reflector: Reflector,
  ) {}

  async onModuleInit() {
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

  private extractKey(cacheKey: CacheOptions['key'], args: any[]) {
    return typeof cacheKey === 'function' ? cacheKey(...args) : cacheKey;
  }

  private registerCache(instance: any, methodName: string) {
    const logger = this.logger;
    const methodRef = instance[methodName];
    const options = this.reflector.get<CacheOptions>(CACHE_DECORATOR, methodRef);

    // Don't register cache on interval when missing parameters
    if (!options) return;

    // Service references
    const cacheManager = this.cacheManager;
    const extractKey = this.extractKey;

    // Augment the method to be cached with caching mechanism
    instance[methodName] = async function (...args: any[]) {
      const cacheKey = extractKey(options.key, args);
      const cachedValue = await cacheManager.get(cacheKey);

      if (cachedValue) {
        return cachedValue;
      } else {
        try {
          const liveData = await methodRef.apply(this, args);
          await cacheManager.set(cacheKey, liveData);
          return liveData;
        } catch (e) {
          logger.error(`@Cache error for ${instance.constructor.name}#${methodName}`, e);
        }
      }
    };
  }
}
