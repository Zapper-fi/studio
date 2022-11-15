import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundAppModule } from '~apps/compound/compound.module';
import { MakerAppModule } from '~apps/maker';

import { BProtocolContractFactory } from './contracts';
import { EthereumBProtocolCompoundBorrowContractPositionFetcher } from './ethereum/b-protocol.compound-borrow.contract-position-fetcher';
import { EthereumBProtocolCompoundSupplyTokenFetcher } from './ethereum/b-protocol.compound-supply.token-fetcher';
import { EthereumLiquityStabilityPoolContractPositionFetcher } from './ethereum/b-protocol.liquity-stability-pool.contract-position-fetcher';
import { EthereumBProtocolMakerVaultContractPositionFetcher } from './ethereum/b-protocol.maker-vault.contract-position-fetcher';

import { BProtocolAppDefinition, B_PROTOCOL_DEFINITION } from '.';

@Register.AppModule({
  appId: B_PROTOCOL_DEFINITION.id,
  imports: [CompoundAppModule, MakerAppModule],
  providers: [
    BProtocolAppDefinition,
    BProtocolContractFactory,
    EthereumBProtocolCompoundSupplyTokenFetcher,
    EthereumBProtocolCompoundBorrowContractPositionFetcher,
    EthereumLiquityStabilityPoolContractPositionFetcher,
    EthereumBProtocolMakerVaultContractPositionFetcher,
  ],
})
export class BProtocolAppModule extends AbstractApp() {}
