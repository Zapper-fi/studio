import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumQiDaoVaultPositionFetcher } from './arbitrum/qi-dao.vault.contract-position-fetcher';
import { AvalancheQiDaoFarmV3ContractPositionFetcher } from './avalanche/qi-dao.farm-v3.contract-position-fetcher';
import { AvalancheQiDaoVaultPositionFetcher } from './avalanche/qi-dao.vault.contract-position-fetcher';
import { BinanceSmartChainQiDaoVaultPositionFetcher } from './binance-smart-chain/qi-dao.vault.contract-position-fetcher';
import { QiDaoViemContractFactory } from './contracts';
import { EthereumQiDaoVaultPositionFetcher } from './ethereum/qi-dao.vault.contract-position-fetcher';
import { FantomQiDaoFarmV3ContractPositionFetcher } from './fantom/qi-dao.farm-v3.contract-position-fetcher';
import { FantomQiDaoFarmContractPositionFetcher } from './fantom/qi-dao.farm.contract-position-fetcher';
import { FantomQiDaoVaultPositionFetcher } from './fantom/qi-dao.vault.contract-position-fetcher';
import { GnosisQiDaoVaultPositionFetcher } from './gnosis/qi-dao.vault.contract-position-fetcher';
import { OptimismQiDaoFarmV3ContractPositionFetcher } from './optimism/qi-dao.farm-v3.contract-position-fetcher';
import { OptimismQiDaoVaultPositionFetcher } from './optimism/qi-dao.vault.contract-position-fetcher';
import { PolygonQiDaoEscrowedQiContractPositionFetcher } from './polygon/qi-dao.escrowed-qi.contract-position-fetcher';
import { PolygonQiDaoFarmV3ContractPositionFetcher } from './polygon/qi-dao.farm-v3.contract-position-fetcher';
import { PolygonQiDaoFarmContractPositionFetcher } from './polygon/qi-dao.farm.contract-position-fetcher';
import { PolygonQiDaoVaultPositionFetcher } from './polygon/qi-dao.vault.contract-position-fetcher';

@Module({
  providers: [
    QiDaoViemContractFactory,
    // Arbitrum
    ArbitrumQiDaoVaultPositionFetcher,
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
    // Polygon
    PolygonQiDaoEscrowedQiContractPositionFetcher,
    PolygonQiDaoFarmContractPositionFetcher,
    PolygonQiDaoFarmV3ContractPositionFetcher,
    PolygonQiDaoVaultPositionFetcher,
  ],
})
export class QiDaoAppModule extends AbstractApp() {}
