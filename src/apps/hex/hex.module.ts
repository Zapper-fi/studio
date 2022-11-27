import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { HexContractFactory } from './contracts';
import { EthereumHexBalanceFetcher } from './ethereum/hex.balance-fetcher';
import { EthereumHexStakeContractPositionFetcher } from './ethereum/hex.stake.contract-position-fetcher';
import { HexAppDefinition, HEX_DEFINITION } from './hex.definition';

@Register.AppModule({
  appId: HEX_DEFINITION.id,
  providers: [HexAppDefinition, HexContractFactory, EthereumHexBalanceFetcher, EthereumHexStakeContractPositionFetcher],
})
export class HexAppModule extends AbstractApp() {}
