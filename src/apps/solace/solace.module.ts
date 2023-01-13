import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AuroraSolaceBondsContractPositionFetcher } from './aurora/solace.bonds.contract-position-fetcher';
import { AuroraSolacePoliciesContractPositionFetcher } from './aurora/solace.policies.contract-position-fetcher';
import { AuroraSolaceXslockerContractPositionFetcher } from './aurora/solace.xs-locker.contract-position-fetcher';
import { SolaceContractFactory } from './contracts';
import { EthereumSolaceBondsContractPositionFetcher } from './ethereum/solace.bonds.contract-position-fetcher';
import { EthereumSolacePoliciesContractPositionFetcher } from './ethereum/solace.policies.contract-position-fetcher';
import { EthereumSolaceScpTokenFetcher } from './ethereum/solace.scp.token-fetcher';
import { EthereumSolaceXsolacev1TokenFetcher } from './ethereum/solace.x-solace-v1.token-fetcher';
import { EthereumSolaceXslockerContractPositionFetcher } from './ethereum/solace.xs-locker.contract-position-fetcher';
import { FantomSolaceBondsContractPositionFetcher } from './fantom/solace.bonds.contract-position-fetcher';
import { FantomSolacePoliciesContractPositionFetcher } from './fantom/solace.policies.contract-position-fetcher';
import { FantomSolaceXslockerContractPositionFetcher } from './fantom/solace.xs-locker.contract-position-fetcher';
import { PolygonSolaceBondsContractPositionFetcher } from './polygon/solace.bonds.contract-position-fetcher';
import { PolygonSolacePoliciesContractPositionFetcher } from './polygon/solace.policies.contract-position-fetcher';
import { PolygonSolaceXslockerContractPositionFetcher } from './polygon/solace.xs-locker.contract-position-fetcher';
import { SolaceAppDefinition } from './solace.definition';

@Module({
  providers: [
    SolaceContractFactory,
    // Ethereum
    EthereumSolaceBondsContractPositionFetcher,
    EthereumSolacePoliciesContractPositionFetcher,
    EthereumSolaceScpTokenFetcher,
    EthereumSolaceXslockerContractPositionFetcher,
    EthereumSolaceXsolacev1TokenFetcher,
    // Aurora
    AuroraSolaceBondsContractPositionFetcher,
    AuroraSolacePoliciesContractPositionFetcher,
    AuroraSolaceXslockerContractPositionFetcher,
    // Polygon
    PolygonSolaceBondsContractPositionFetcher,
    PolygonSolacePoliciesContractPositionFetcher,
    PolygonSolaceXslockerContractPositionFetcher,
    // Fantom
    FantomSolaceBondsContractPositionFetcher,
    FantomSolacePoliciesContractPositionFetcher,
    FantomSolaceXslockerContractPositionFetcher,
  ],
})
export class SolaceAppModule extends AbstractApp() {}
