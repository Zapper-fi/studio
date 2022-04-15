import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { AppRegistry } from '~app/apps.registry';
import { AppService } from '~app/apps.service';

import { AppController } from './app.controller';

@Module({
  imports: [DiscoveryModule],
  controllers: [AppController],
  providers: [AppService, AppRegistry],
  exports: [AppService],
})
export class AppModule {}
