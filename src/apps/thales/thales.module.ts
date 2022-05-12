import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ThalesContractFactory } from './contracts';
import { EthereumThalesBalanceFetcher } from './ethereum/thales.balance-fetcher';
import { EthereumThalesEscrowContractPositionFetcher } from './ethereum/thales.escrow.contract-position-fetcher';
import { EthereumThalesPool2ContractPositionFetcher } from './ethereum/thales.pool2.contract-position-fetcher';
import { EthereumThalesStakingContractPositionFetcher } from './ethereum/thales.staking.contract-position-fetcher';
import { OptimismThalesBalanceFetcher } from './optimism/thales.balance-fetcher';
import { OptimismThalesEscrowContractPositionFetcher } from './optimism/thales.escrow.contract-position-fetcher';
import { OptimismThalesPool2ContractPositionFetcher } from './optimism/thales.pool2.contract-position-fetcher';
import { OptimismThalesStakingContractPositionFetcher } from './optimism/thales.staking.contract-position-fetcher';
import { PolygonThalesBalanceFetcher } from './polygon/thales.balance-fetcher';
import { PolygonThalesEscrowContractPositionFetcher } from './polygon/thales.escrow.contract-position-fetcher';
import { PolygonThalesPool2ContractPositionFetcher } from './polygon/thales.pool2.contract-position-fetcher';
import { PolygonThalesStakingContractPositionFetcher } from './polygon/thales.staking.contract-position-fetcher';
import { ThalesAppDefinition, THALES_DEFINITION } from './thales.definition';

@Register.AppModule({
  appId: THALES_DEFINITION.id,
  providers: [
    ThalesAppDefinition,
    ThalesContractFactory,
    EthereumThalesBalanceFetcher,
    EthereumThalesStakingContractPositionFetcher,
    EthereumThalesEscrowContractPositionFetcher,
    EthereumThalesPool2ContractPositionFetcher,
    PolygonThalesBalanceFetcher,
    PolygonThalesStakingContractPositionFetcher,
    PolygonThalesEscrowContractPositionFetcher,
    PolygonThalesPool2ContractPositionFetcher,
    OptimismThalesBalanceFetcher,
    OptimismThalesStakingContractPositionFetcher,
    OptimismThalesEscrowContractPositionFetcher,
    OptimismThalesPool2ContractPositionFetcher,
  ],
})
export class ThalesAppModule extends AbstractApp() {}
