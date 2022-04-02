import { Controller, Get, Inject, NotFoundException, Param, Query } from '@nestjs/common';

import { GetPositionsQuery } from './dto/get-positions-query.dto';
import { PositionService } from './position.service';

@Controller('/apps')
export class PositionController {
  constructor(@Inject(PositionService) private readonly positionService: PositionService) {}

  @Get(`/:appId/tokens`)
  getAppTokenPositions(@Param('appId') appId: string, @Query() query: GetPositionsQuery) {
    try {
      return this.positionService.getAppTokenPositions({ ...query, appId });
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @Get(`/:appId/positions`)
  getAppContractPositions(@Param('appId') appId: string, @Query() query: GetPositionsQuery) {
    try {
      return this.positionService.getAppContractPositions({ ...query, appId });
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
