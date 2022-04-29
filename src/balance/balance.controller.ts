import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { BalanceService } from './balance.service';
import { GetBalancesQuery } from './dto/get-balances-query.dto';

@Controller()
export class BalanceController {
  constructor(@Inject(BalanceService) private readonly balanceService: BalanceService) {}

  @ApiOperation({
    summary: 'Balances',
    description: 'Gets the balances for a set of addresses for a single network.',
  })
  @ApiTags('Balances')
  @Get(`/apps/:appId/balances`)
  getAppBalances(@Param('appId') appId: string, @Query() query: GetBalancesQuery) {
    return this.balanceService.getBalances({ ...query, appId });
  }
}
