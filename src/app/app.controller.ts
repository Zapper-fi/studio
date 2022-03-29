import { Controller, Get, Inject, NotFoundException, Param, Query } from '@nestjs/common';

import { AppService } from './app.service';
import { GetAppBalancesQuery } from './dto/get-app-balances-query.dto';

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

  @Get(`/:appId/balances`)
  getAppBalances(@Param('appId') appId: string, @Query() query: GetAppBalancesQuery) {
    return this.appService.getAppBalances({ ...query, appId });
  }
}
