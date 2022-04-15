import { Controller, Get, Inject, Param, Query } from '@nestjs/common';

import { GetTvlParams } from '~stats/dto/get-tvl-params.dto';
import { GetTvlQuery } from '~stats/dto/get-tvl-query.dto';

import { TvlService } from './tvl.service';

@Controller()
export class TvlController {
  constructor(@Inject(TvlService) private readonly tvlService: TvlService) {}

  @Get('/apps/:appId/tvl')
  async getTvl(@Param() params: GetTvlParams, @Query() query: GetTvlQuery) {
    return this.tvlService.getTvl({ ...params, ...query });
  }
}
