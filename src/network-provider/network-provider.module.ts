import { Module } from '@nestjs/common';

import { NetworkProviderService } from './network-provider.service';

@Module({
  providers: [NetworkProviderService],
  exports: [NetworkProviderService],
})
export class NetworkProviderModule {}
