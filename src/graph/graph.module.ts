import { Module } from '@nestjs/common';

import { GraphService } from './graph.service';

@Module({
  providers: [GraphService],
  exports: [GraphService],
})
export class GraphModule {}
