import { Register } from '~app-toolkit/decorators';

import { AbstractApp } from '~app/app.dynamic-module';

import { ThalesContractFactory } from './contracts';
import { EthereumThalesBalanceFetcher } from './ethereum/thales.balance-fetcher';
import { EthereumThalesEscrowContractPositionFetcher } from './ethereum/thales.escrow.contract-position-fetcher';
import { EthereumThalesMarketTokenFetcher } from './ethereum/thales.market.token-fetcher';
import { EthereumThalesOpthalesTokenFetcher } from './ethereum/thales.opthales.token-fetcher';
import { EthereumThalesPool2ContractPositionFetcher } from './ethereum/thales.pool2.contract-position-fetcher';
import { EthereumThalesStakingContractPositionFetcher } from './ethereum/thales.staking.contract-position-fetcher';
import { OptimismThalesBalanceFetcher } from './optimism/thales.balance-fetcher';
import { OptimismThalesEscrowContractPositionFetcher } from './optimism/thales.escrow.contract-position-fetcher';
import { OptimismThalesMarketTokenFetcher } from './optimism/thales.market.token-fetcher';
import { OptimismThalesOpthalesTokenFetcher } from './optimism/thales.opthales.token-fetcher';
import { OptimismThalesPool2ContractPositionFetcher } from './optimism/thales.pool2.contract-position-fetcher';
import { OptimismThalesStakingContractPositionFetcher } from './optimism/thales.staking.contract-position-fetcher';
import { PolygonThalesBalanceFetcher } from './polygon/thales.balance-fetcher';
import { PolygonThalesEscrowContractPositionFetcher } from './polygon/thales.escrow.contract-position-fetcher';
import { PolygonThalesMarketTokenFetcher } from './polygon/thales.market.token-fetcher';
import { PolygonThalesOpthalesTokenFetcher } from './polygon/thales.opthales.token-fetcher';
import { PolygonThalesPool2ContractPositionFetcher } from './polygon/thales.pool2.contract-position-fetcher';
import { PolygonThalesStakingContractPositionFetcher } from './polygon/thales.staking.contract-position-fetcher';
import { ThalesAppDefinition, THALES_DEFINITION } from './thales.definition';

@Register.AppModule({
  appId: THALES_DEFINITION.id,
  providers: [
    ThalesAppDefinition,
    ThalesContractFactory,
    EthereumThalesBalanceFetcher,
    EthereumThalesMarketTokenFetcher,
    EthereumThalesStakingContractPositionFetcher,
    EthereumThalesEscrowContractPositionFetcher,
    EthereumThalesPool2ContractPositionFetcher,
    EthereumThalesOpthalesTokenFetcher,
    PolygonThalesBalanceFetcher,
    PolygonThalesMarketTokenFetcher,
    PolygonThalesStakingContractPositionFetcher,
    PolygonThalesEscrowContractPositionFetcher,
    PolygonThalesPool2ContractPositionFetcher,
    PolygonThalesOpthalesTokenFetcher,
    OptimismThalesBalanceFetcher,
    OptimismThalesMarketTokenFetcher,
    OptimismThalesStakingContractPositionFetcher,
    OptimismThalesEscrowContractPositionFetcher,
    OptimismThalesPool2ContractPositionFetcher,
    OptimismThalesOpthalesTokenFetcher,
  ],
})
export class ThalesAppModule extends AbstractApp() { }
