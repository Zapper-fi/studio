import { Controller, Get, Inject, NotFoundException, Param } from '@nestjs/common';

import { AppService } from './apps.service';

@Controller('/apps')
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Get()
  getApps() {
    return this.appService.getApps();
  }

  @Get(`/:appId`)
  getApp(@Param('appId') appId: string) {
    try {
      return this.appService.getApp(appId);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
