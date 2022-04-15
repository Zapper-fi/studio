import { Controller, Get, Inject, Param, Query } from '@nestjs/common';

import { BalanceService } from './balance.service';
import { GetBalancesQuery } from './dto/get-balances-query.dto';

@Controller()
export class BalanceController {
  constructor(@Inject(BalanceService) private readonly balanceService: BalanceService) {}

  @Get(`/apps/:appId/balances`)
  getAppBalances(@Param('appId') appId: string, @Query() query: GetBalancesQuery) {
    return this.balanceService.getBalances({ ...query, appId });
  }
}
