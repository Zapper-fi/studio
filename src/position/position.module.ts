import { Module } from '@nestjs/common';

import { PositionService } from './position.service';

@Module({
  providers: [PositionService],
  exports: [PositionService],
})
export class PositionModule {}
