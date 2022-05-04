import { Controller, Get, Inject, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetPositionsQuery } from './dto/get-positions-query.dto';
import { PositionService } from './position.service';

@Controller('/apps')
export class PositionController {
  constructor(@Inject(PositionService) private readonly positionService: PositionService) {}

  @ApiTags('Positions')
  @ApiOperation({
    summary: 'Application Position Tokens',
    description: 'Retrieve all application position tokens for a given application for a single network.',
  })
  @Get(`/:appId/tokens`)
  getAppTokenPositions(@Param('appId') appId: string, @Query() query: GetPositionsQuery) {
    try {
      return this.positionService.getAppTokenPositions({ ...query, appId });
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @ApiTags('Positions')
  @ApiOperation({
    summary: 'Application Contract Positions',
    description: 'Retrieve positions (non-tokenized) for a given application.',
  })
  @Get(`/:appId/positions`)
  getAppContractPositions(@Param('appId') appId: string, @Query() query: GetPositionsQuery) {
    try {
      return this.positionService.getAppContractPositions({ ...query, appId });
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
