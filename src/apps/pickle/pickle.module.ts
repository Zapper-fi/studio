import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV3LiquidityContractPositionBuilder } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-builder';
import { UniswapV3ViemContractFactory } from '~apps/uniswap-v3/contracts';

import { ArbitrumPickleJarTokenFetcher } from './arbitrum/pickle.jar.token-fetcher';
import { ArbitrumPickleFarmContractPositionFetcher } from './arbitrum/pickle.masterchef-v2-farm.contract-position-fetcher';
import { PickleApiJarRegistry } from './common/pickle.api.jar-registry';
import { PickleViemContractFactory } from './contracts';
import { EthereumUniV3PickleJarTokenFetcher } from './ethereum/pickle.jar-univ3.token-fetcher';
import { EthereumPickleJarTokenFetcher } from './ethereum/pickle.jar.token-fetcher';
import { EthereumPickleFarmContractPositionFetcher } from './ethereum/pickle.masterchef-farm.contract-position-fetcher';
import { EthereumPickleSingleRewardPositionFetcher } from './ethereum/pickle.single-staking-farm.contract-position-fetcher';
import { EthereumPickleVotingEscrowContractPositionFetcher } from './ethereum/pickle.voting-escrow.contract-position-fetcher';
import { GnosisPickleJarTokenFetcher } from './gnosis/pickle.jar.token-fetcher';
import { OptimismUniV3PickleJarTokenFetcher } from './optimism/pickle.jar-univ3.token-fetcher';
import { OptimismPickleJarTokenFetcher } from './optimism/pickle.jar.token-fetcher';
import { OptimismPickleFarmContractPositionFetcher } from './optimism/pickle.masterchef-v2-farm.contract-position-fetcher';
import { PolygonUniV3PickleJarTokenFetcher } from './polygon/pickle.jar-univ3.token-fetcher';
import { PolygonPickleJarTokenFetcher } from './polygon/pickle.jar.token-fetcher';
import { PolygonPickleFarmContractPositionFetcher } from './polygon/pickle.masterchef-v2-farm.contract-position-fetcher';

@Module({
  providers: [
    PickleViemContractFactory,
    UniswapV3ViemContractFactory,
    UniswapV3LiquidityContractPositionBuilder,
    PickleApiJarRegistry,

    ArbitrumPickleFarmContractPositionFetcher,
    ArbitrumPickleJarTokenFetcher,
    EthereumPickleFarmContractPositionFetcher,
    EthereumPickleJarTokenFetcher,
    EthereumPickleSingleRewardPositionFetcher,
    EthereumPickleVotingEscrowContractPositionFetcher,
    EthereumUniV3PickleJarTokenFetcher,
    GnosisPickleJarTokenFetcher,
    OptimismPickleFarmContractPositionFetcher,
    OptimismPickleJarTokenFetcher,
    OptimismUniV3PickleJarTokenFetcher,
    PolygonPickleFarmContractPositionFetcher,
    PolygonPickleJarTokenFetcher,
    PolygonUniV3PickleJarTokenFetcher,
  ],
})
export class PickleAppModule extends AbstractApp() {}
