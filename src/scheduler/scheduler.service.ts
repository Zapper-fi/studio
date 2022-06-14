import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import chalk from 'chalk';

import { SCHEDULER_INTERVAL } from './scheduler.constants';
import { ScheduleOptions } from './scheduler.decorator';

@Injectable()
export class SchedulerService implements OnModuleInit, OnModuleDestroy {
  private readonly intervals: NodeJS.Timer[] = [];
  private logger = new Logger(SchedulerService.name);

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
            this.registerSchedule(wrapper.instance, methodName);
          },
        );
      });
  }

  onModuleDestroy() {
    this.intervals.forEach(interval => clearInterval(interval));
  }

  private registerSchedule(instance: any, methodName: string) {
    const logger = this.logger;
    const methodRef = instance[methodName];
    const intervalTimeout: ScheduleOptions['every'] = this.reflector.get(SCHEDULER_INTERVAL, methodRef);

    // Don't register interval when missing parameters
    if (!intervalTimeout) return;

    let liveData = methodRef.apply(instance);
    // Duck typing shennanigans
    if (!liveData.then) {
      liveData = new Promise(liveData);
    }

    liveData
      .then(() => {
        logger.log(`@Schedule executed for ${instance.constructor.name}#${methodName}`);
      })
      .catch((e: Error) => {
        logger.error(`@Schedule error init for ${instance.constructor.name}#${methodName}: ${e.message}`);
        logger.error(chalk.gray(e.stack));
      });

    // Save the interval
    const interval = setInterval(() => {
      methodRef.apply(instance).catch((e: Error) => {
        logger.error(`@Schedule target error for ${instance.constructor.name}#${methodName}: ${e.message}`);
        logger.error(chalk.gray(e.stack));
      });
    }, intervalTimeout);

    this.intervals.push(interval);
  }
}
