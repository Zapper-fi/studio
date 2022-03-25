import { Module } from '@nestjs/common';

import { ContractModule } from '~contract/contract.module';
import { MulticallModule } from '~multicall/multicall.module';
import { NetworkProviderModule } from '~network-provider/network-provider.module';
import { TokenModule } from '~token/token.module';

import { AppToolkit } from './app-toolkit.service';

@Module({
  imports: [ContractModule, MulticallModule, NetworkProviderModule, TokenModule],
  providers: [AppToolkit],
  exports: [AppToolkit],
})
export class AppToolkitModule {}
