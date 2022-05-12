import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CurveAppModule } from '~apps/curve';
import { SynthetixAppModule } from '~apps/synthetix';

import { ArbitrumPickleBalanceFetcher } from './arbitrum/pickle.balance-fetcher';
import { ArbitrumPickleFarmContractPositionFetcher } from './arbitrum/pickle.farm.contract-position-fetcher';
import { ArbitrumPickleJarTokenFetcher } from './arbitrum/pickle.jar.token-fetcher';
import { PickleContractFactory } from './contracts';
import { EthereumPickleBalanceFetcher } from './ethereum/pickle.balance-fetcher';
import { EthereumPickleFarmContractPositionFetcher } from './ethereum/pickle.farm.contract-position-fetcher';
import { EthereumPickleJarTokenFetcher } from './ethereum/pickle.jar.token-fetcher';
import { EthereumPickleSingleRewardPositionFetcher } from './ethereum/pickle.single-staking.contract-position-fetcher';
import { EthereumPickleVotingEscrowContractPositionFetcher } from './ethereum/pickle.voting-escrow.contract-position-fetcher';
import { PickleApiJarRegistry } from './helpers/pickle.api.jar-registry';
import { PickleOnChainJarRegistry } from './helpers/pickle.on-chain.jar-registry';
import { PickleAppDefinition, PICKLE_DEFINITION } from './pickle.definition';
import { PolygonPickleBalanceFetcher } from './polygon/pickle.balance-fetcher';
import { PolygonPickleFarmContractPositionFetcher } from './polygon/pickle.farm.contract-position-fetcher';
import { PolygonPickleJarTokenFetcher } from './polygon/pickle.jar.token-fetcher';

@Register.AppModule({
  appId: PICKLE_DEFINITION.id,
  imports: [SynthetixAppModule, CurveAppModule],
  providers: [
    PickleAppDefinition,
    PickleApiJarRegistry,
    PickleOnChainJarRegistry,
    PickleContractFactory,
    // Arbitrum
    ArbitrumPickleJarTokenFetcher,
    ArbitrumPickleFarmContractPositionFetcher,
    ArbitrumPickleBalanceFetcher,
    // Ethereum
    EthereumPickleJarTokenFetcher,
    EthereumPickleSingleRewardPositionFetcher,
    EthereumPickleFarmContractPositionFetcher,
    EthereumPickleVotingEscrowContractPositionFetcher,
    EthereumPickleBalanceFetcher,
    // Polygon
    PolygonPickleJarTokenFetcher,
    PolygonPickleFarmContractPositionFetcher,
    PolygonPickleBalanceFetcher,
  ],
})
export class PickleAppModule extends AbstractApp() {}
