import { Module } from '@nestjs/common';

import { AppToolkitModule } from '~app-toolkit/app-toolkit.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AppToolkitModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
