import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumWombatExchangePoolTokenFetcher } from './arbitrum/wombat-exchange.pool.token-fetcher';
import { ArbitrumWombatExchangeVotingEscrowContractPositionFetcher } from './arbitrum/wombat-exchange.voting-escrow.contract-position-fetcher';
import { BinanceSmartChainWombatExchangeFarmContractPositionFetcher } from './binance-smart-chain/wombat-exchange.farm.contract-position-fetcher';
import { BinanceSmartChainWombatExchangePoolTokenFetcher } from './binance-smart-chain/wombat-exchange.pool.token-fetcher';
import { BinanceSmartChainWombatExchangeVotingEscrowContractPositionFetcher } from './binance-smart-chain/wombat-exchange.voting-escrow.contract-position-fetcher';
import { WombatExchangeViemContractFactory } from './contracts';

@Module({
  providers: [
    WombatExchangeViemContractFactory,
    // Arbitrum
    ArbitrumWombatExchangePoolTokenFetcher,
    ArbitrumWombatExchangeVotingEscrowContractPositionFetcher,
    // Binance-Smart-Chain
    BinanceSmartChainWombatExchangePoolTokenFetcher,
    BinanceSmartChainWombatExchangeFarmContractPositionFetcher,
    BinanceSmartChainWombatExchangeVotingEscrowContractPositionFetcher,
  ],
})
export class WombatExchangeAppModule extends AbstractApp() {}
