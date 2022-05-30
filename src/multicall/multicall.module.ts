import { Module } from '@nestjs/common';

import { NetworkProviderModule } from '~network-provider/network-provider.module';

import { MulticallService } from './multicall.service';

@Module({
  imports: [NetworkProviderModule],
  providers: [MulticallService],
  exports: [MulticallService],
})
export class MulticallModule {}
