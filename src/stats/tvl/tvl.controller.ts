import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetTvlParams } from '~stats/dto/get-tvl-params.dto';
import { GetTvlQuery } from '~stats/dto/get-tvl-query.dto';

import { TvlService } from './tvl.service';

@Controller()
export class TvlController {
  constructor(@Inject(TvlService) private readonly tvlService: TvlService) {}

  @ApiOperation({
    summary: 'TVL',
    description: 'Get the tvl (total value locked) for a given application for a single network',
  })
  @ApiTags('TVL')
  @Get('/apps/:appId/tvl')
  async getTvl(@Param() params: GetTvlParams, @Query() query: GetTvlQuery) {
    return this.tvlService.getTvl({ ...params, ...query });
  }
}
