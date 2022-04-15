import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { AppRegistry } from '~app/app.registry';
import { AppService } from '~app/app.service';

import { AppController } from './app.controller';

@Module({
  imports: [DiscoveryModule],
  controllers: [AppController],
  providers: [AppService, AppRegistry],
  exports: [AppService],
})
export class AppModule {}
