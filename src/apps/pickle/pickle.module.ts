import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV3LiquidityContractPositionBuilder } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-builder';
import { UniswapV3ContractFactory } from '~apps/uniswap-v3/contracts';

import { ArbitrumPickleJarTokenFetcher } from './arbitrum/pickle.jar.token-fetcher';
import { ArbitrumPickleFarmContractPositionFetcher } from './arbitrum/pickle.masterchef-v2-farm.contract-position-fetcher';
import { AuroraPickleJarTokenFetcher } from './aurora/pickle.jar.token-fetcher';
import { PickleApiJarRegistry } from './common/pickle.api.jar-registry';
import { PickleContractFactory } from './contracts';
import { CronosPickleJarTokenFetcher } from './cronos/pickle.jar.token-fetcher';
import { EthereumUniV3PickleJarTokenFetcher } from './ethereum/pickle.jar-univ3.token-fetcher';
import { EthereumPickleJarTokenFetcher } from './ethereum/pickle.jar.token-fetcher';
import { EthereumPickleFarmContractPositionFetcher } from './ethereum/pickle.masterchef-farm.contract-position-fetcher';
import { EthereumPickleSingleRewardPositionFetcher } from './ethereum/pickle.single-staking-farm.contract-position-fetcher';
import { EthereumPickleVotingEscrowContractPositionFetcher } from './ethereum/pickle.voting-escrow.contract-position-fetcher';
import { FantomPickleJarTokenFetcher } from './fantom/pickle.jar.token-fetcher';
import { GnosisPickleJarTokenFetcher } from './gnosis/pickle.jar.token-fetcher';
import { MoonriverPickleJarTokenFetcher } from './moonriver/pickle.jar.token-fetcher';
import { OptimismUniV3PickleJarTokenFetcher } from './optimism/pickle.jar-univ3.token-fetcher';
import { OptimismPickleJarTokenFetcher } from './optimism/pickle.jar.token-fetcher';
import { OptimismPickleFarmContractPositionFetcher } from './optimism/pickle.masterchef-v2-farm.contract-position-fetcher';
import { PickleAppDefinition, PICKLE_DEFINITION } from './pickle.definition';
import { PolygonUniV3PickleJarTokenFetcher } from './polygon/pickle.jar-univ3.token-fetcher';
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
    EthereumUniV3PickleJarTokenFetcher,
    FantomPickleJarTokenFetcher,
    GnosisPickleJarTokenFetcher,
    MoonriverPickleJarTokenFetcher,
    OptimismPickleFarmContractPositionFetcher,
    OptimismPickleJarTokenFetcher,
    OptimismUniV3PickleJarTokenFetcher,
    PickleApiJarRegistry,
    PickleAppDefinition,
    PickleContractFactory,
    PolygonPickleFarmContractPositionFetcher,
    PolygonPickleJarTokenFetcher,
    PolygonUniV3PickleJarTokenFetcher,
    UniswapV3ContractFactory,
    UniswapV3LiquidityContractPositionBuilder,
  ],
})
export class PickleAppModule extends AbstractApp() {}
