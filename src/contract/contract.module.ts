import { Module } from '@nestjs/common';

import { NetworkProviderModule } from '~network-provider/network-provider.module';

import { ContractFactory } from './contracts';

@Module({
  imports: [NetworkProviderModule],
  providers: [ContractFactory],
  exports: [ContractFactory],
})
export class ContractModule {}
