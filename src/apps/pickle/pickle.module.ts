import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumPickleFarmContractPositionFetcher } from './arbitrum/pickle.farm.contract-position-fetcher';
import { ArbitrumPickleJarTokenFetcher } from './arbitrum/pickle.jar.token-fetcher';
import { PickleApiJarRegistry } from './common/pickle.api.jar-registry';
import { PickleContractFactory } from './contracts';
import { EthereumPickleFarmContractPositionFetcher } from './ethereum/pickle.farm.contract-position-fetcher';
import { EthereumPickleJarTokenFetcher } from './ethereum/pickle.jar.token-fetcher';
import { EthereumPickleSingleRewardPositionFetcher } from './ethereum/pickle.single-staking.contract-position-fetcher';
import { EthereumPickleVotingEscrowContractPositionFetcher } from './ethereum/pickle.voting-escrow.contract-position-fetcher';
import { PickleAppDefinition, PICKLE_DEFINITION } from './pickle.definition';
import { PolygonPickleFarmContractPositionFetcher } from './polygon/pickle.farm.contract-position-fetcher';
import { PolygonPickleJarTokenFetcher } from './polygon/pickle.jar.token-fetcher';

@Register.AppModule({
  appId: PICKLE_DEFINITION.id,
  providers: [
    PickleAppDefinition,
    PickleApiJarRegistry,
    PickleContractFactory,
    // Arbitrum
    ArbitrumPickleJarTokenFetcher,
    ArbitrumPickleFarmContractPositionFetcher,
    // Ethereum
    EthereumPickleJarTokenFetcher,
    EthereumPickleSingleRewardPositionFetcher,
    EthereumPickleFarmContractPositionFetcher,
    EthereumPickleVotingEscrowContractPositionFetcher,
    // Polygon
    PolygonPickleJarTokenFetcher,
    PolygonPickleFarmContractPositionFetcher,
  ],
})
export class PickleAppModule extends AbstractApp() {}
