import { Module } from '@nestjs/common';

import { ContractModule } from '~contract/contract.module';
import { NetworkProviderModule } from '~network-provider/network-provider.module';

import { MulticallService } from './multicall.service';

@Module({
  imports: [ContractModule, NetworkProviderModule],
  providers: [MulticallService],
  exports: [MulticallService],
})
export class MulticallModule {}
