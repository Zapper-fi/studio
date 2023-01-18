import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';

import { AppRegistry } from '~app/app.registry';
import { AppService } from '~app/app.service';

import { AppApiSource } from './app.api';

@Module({
  imports: [DiscoveryModule, ConfigModule],
  providers: [AppService, AppApiSource, AppRegistry],
  exports: [AppService],
})
export class AppModule {}
