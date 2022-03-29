import { Controller, Get, Inject, NotFoundException, Query } from '@nestjs/common';

import { AppService } from './app.service';

@Controller('/apps')
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Get()
  getApps() {
    return this.appService.getApps();
  }

  @Get(`/:id`)
  getApp(@Query('id') appId: string) {
    try {
      return this.appService.getApp(appId);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
