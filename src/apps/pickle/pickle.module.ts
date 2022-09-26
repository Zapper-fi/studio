import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumPickleJarTokenFetcher } from './arbitrum/pickle.jar.token-fetcher';
import { ArbitrumPickleFarmContractPositionFetcher } from './arbitrum/pickle.masterchef-v2-farm.contract-position-fetcher';
import { AuroraPickleJarTokenFetcher } from './aurora/pickle.jar.token-fetcher';
import { PickleApiJarRegistry } from './common/pickle.api.jar-registry';
import { PickleContractFactory } from './contracts';
import { CronosPickleJarTokenFetcher } from './cronos/pickle.jar.token-fetcher';
import { EthereumPickleJarTokenFetcher } from './ethereum/pickle.jar.token-fetcher';
import { EthereumPickleFarmContractPositionFetcher } from './ethereum/pickle.masterchef-farm.contract-position-fetcher';
import { EthereumPickleSingleRewardPositionFetcher } from './ethereum/pickle.single-staking-farm.contract-position-fetcher';
import { EthereumPickleVotingEscrowContractPositionFetcher } from './ethereum/pickle.voting-escrow.contract-position-fetcher';
import { FantomPickleJarTokenFetcher } from './fantom/pickle.jar.token-fetcher';
import { GnosisPickleJarTokenFetcher } from './gnosis/pickle.jar.token-fetcher';
import { MoonriverPickleJarTokenFetcher } from './moonriver/pickle.jar.token-fetcher';
import { OptimismPickleJarTokenFetcher } from './optimism/pickle.jar.token-fetcher';
import { OptimismPickleFarmContractPositionFetcher } from './optimism/pickle.masterchef-v2-farm.contract-position-fetcher';
import { PickleAppDefinition, PICKLE_DEFINITION } from './pickle.definition';
import { PolygonPickleJarTokenFetcher } from './polygon/pickle.jar.token-fetcher';
import { PolygonPickleFarmContractPositionFetcher } from './polygon/pickle.masterchef-v2-farm.contract-position-fetcher';

@Register.AppModule({
  appId: PICKLE_DEFINITION.id,
  providers: [
    ArbitrumPickleFarmContractPositionFetcher,
    ArbitrumPickleJarTokenFetcher,
    AuroraPickleJarTokenFetcher,
    CronosPickleJarTokenFetcher,
    EthereumPickleFarmContractPositionFetcher,
    EthereumPickleJarTokenFetcher,
    EthereumPickleSingleRewardPositionFetcher,
    EthereumPickleVotingEscrowContractPositionFetcher,
    FantomPickleJarTokenFetcher,
    GnosisPickleJarTokenFetcher,
    MoonriverPickleJarTokenFetcher,
    OptimismPickleFarmContractPositionFetcher,
    OptimismPickleJarTokenFetcher,
    PickleApiJarRegistry,
    PickleAppDefinition,
    PickleContractFactory,
    PolygonPickleFarmContractPositionFetcher,
    PolygonPickleJarTokenFetcher,
  ],
})
export class PickleAppModule extends AbstractApp() {}
