import { Controller, Get, Inject, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetPositionsQuery } from './dto/get-positions-query.dto';
import { PositionService } from './position.service';

@Controller('/apps')
export class TvlController {
  constructor(@Inject(PositionService) private readonly positionService: PositionService) {}

  @ApiTags('TVL')
  @ApiOperation({
    summary: 'Application Total Value Locked',
    description: 'Retrieve TVL for a given application for a single network.',
  })
  @Get(`/:appId/tvl`)
  getAppTvl(@Param('appId') appId: string, @Query() query: GetPositionsQuery) {
    try {
      return this.positionService.getAppTokenPositions({ ...query, appId });
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
