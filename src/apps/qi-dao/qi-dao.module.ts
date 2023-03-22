import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumQiDaoVaultPositionFetcher } from './arbitrum/qi-dao.vault.contract-position-fetcher';
import { ArbitrumWrappedTokenTokenFetcher } from './arbitrum/qi-dao.wrapped-token.token-fetcher';
import { AvalancheQiDaoFarmV3ContractPositionFetcher } from './avalanche/qi-dao.farm-v3.contract-position-fetcher';
import { AvalancheQiDaoVaultPositionFetcher } from './avalanche/qi-dao.vault.contract-position-fetcher';
import { BinanceSmartChainQiDaoVaultPositionFetcher } from './binance-smart-chain/qi-dao.vault.contract-position-fetcher';
import { QiDaoContractFactory } from './contracts';
import { EthereumQiDaoVaultPositionFetcher } from './ethereum/qi-dao.vault.contract-position-fetcher';
import { FantomQiDaoFarmV3ContractPositionFetcher } from './fantom/qi-dao.farm-v3.contract-position-fetcher';
import { FantomQiDaoFarmContractPositionFetcher } from './fantom/qi-dao.farm.contract-position-fetcher';
import { FantomQiDaoVaultPositionFetcher } from './fantom/qi-dao.vault.contract-position-fetcher';
import { GnosisQiDaoVaultPositionFetcher } from './gnosis/qi-dao.vault.contract-position-fetcher';
import { OptimismQiDaoFarmV3ContractPositionFetcher } from './optimism/qi-dao.farm-v3.contract-position-fetcher';
import { OptimismQiDaoVaultPositionFetcher } from './optimism/qi-dao.vault.contract-position-fetcher';
import { OptimismWrappedTokenTokenFetcher } from './optimism/qi-dao.wrapped-token.token-fetcher';
import { PolygonQiDaoEscrowedQiContractPositionFetcher } from './polygon/qi-dao.escrowed-qi.contract-position-fetcher';
import { PolygonQiDaoFarmV3ContractPositionFetcher } from './polygon/qi-dao.farm-v3.contract-position-fetcher';
import { PolygonQiDaoFarmContractPositionFetcher } from './polygon/qi-dao.farm.contract-position-fetcher';
import { PolygonQiDaoVaultPositionFetcher } from './polygon/qi-dao.vault.contract-position-fetcher';
import { PolygonWrappedTokenTokenFetcher } from './polygon/qi-dao.wrapped-token.token-fetcher';
import { PolygonQiDaoYieldTokenFetcher } from './polygon/qi-dao.yield.token-fetcher';

@Module({
  providers: [
    QiDaoContractFactory,
    // Arbitrum
    ArbitrumQiDaoVaultPositionFetcher,
    ArbitrumWrappedTokenTokenFetcher,
    // Avalanche
    AvalancheQiDaoFarmV3ContractPositionFetcher,
    AvalancheQiDaoVaultPositionFetcher,
    // Binance-Smart-Chain
    BinanceSmartChainQiDaoVaultPositionFetcher,
    // Ethereum
    EthereumQiDaoVaultPositionFetcher,
    // Fantom
    FantomQiDaoFarmContractPositionFetcher,
    FantomQiDaoFarmV3ContractPositionFetcher,
    FantomQiDaoVaultPositionFetcher,
    // Gnosis
    GnosisQiDaoVaultPositionFetcher,
    // Optimism
    OptimismQiDaoVaultPositionFetcher,
    OptimismQiDaoFarmV3ContractPositionFetcher,
    OptimismWrappedTokenTokenFetcher,
    // Polygon
    PolygonQiDaoEscrowedQiContractPositionFetcher,
    PolygonQiDaoFarmContractPositionFetcher,
    PolygonQiDaoFarmV3ContractPositionFetcher,
    PolygonQiDaoVaultPositionFetcher,
    PolygonQiDaoYieldTokenFetcher,
    PolygonWrappedTokenTokenFetcher,
  ],
})
export class QiDaoAppModule extends AbstractApp() {}
