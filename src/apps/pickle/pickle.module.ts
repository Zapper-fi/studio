import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumPickleJarTokenFetcher } from './arbitrum/pickle.jar.token-fetcher';
import { ArbitrumPickleFarmContractPositionFetcher } from './arbitrum/pickle.masterchef-v2-farm.contract-position-fetcher';
import { PickleApiJarRegistry } from './common/pickle.api.jar-registry';
import { PickleContractFactory } from './contracts';
import { EthereumPickleJarTokenFetcher } from './ethereum/pickle.jar.token-fetcher';
import { EthereumPickleFarmContractPositionFetcher } from './ethereum/pickle.masterchef-farm.contract-position-fetcher';
import { EthereumPickleSingleRewardPositionFetcher } from './ethereum/pickle.single-staking-farm.contract-position-fetcher';
import { EthereumPickleVotingEscrowContractPositionFetcher } from './ethereum/pickle.voting-escrow.contract-position-fetcher';
import { PickleAppDefinition, PICKLE_DEFINITION } from './pickle.definition';
import { PolygonPickleJarTokenFetcher } from './polygon/pickle.jar.token-fetcher';
import { PolygonPickleFarmContractPositionFetcher } from './polygon/pickle.masterchef-v2-farm.contract-position-fetcher';

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
