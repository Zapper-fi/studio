import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { SolaceContractFactory } from './contracts';
import { EthereumSolaceBalanceFetcher } from './ethereum/solace.balance-fetcher';
import { EthereumSolaceBondsContractPositionFetcher } from './ethereum/solace.bonds.contract-position-fetcher';
import { EthereumSolacePoliciesContractPositionFetcher } from './ethereum/solace.policies.contract-position-fetcher';
import { EthereumSolaceScpTokenFetcher } from './ethereum/solace.scp.token-fetcher';
import { EthereumSolaceTvlFetcher } from './ethereum/solace.tvl-fetcher';
import { EthereumSolaceXslockerContractPositionFetcher } from './ethereum/solace.xslocker.contract-position-fetcher';
import { EthereumSolaceXsolacev1TokenFetcher } from './ethereum/solace.xsolacev1.token-fetcher';
import { PolygonSolaceBalanceFetcher } from './polygon/solace.balance-fetcher';
import { PolygonSolaceBondsContractPositionFetcher } from './polygon/solace.bonds.contract-position-fetcher';
import { PolygonSolacePoliciesContractPositionFetcher } from './polygon/solace.policies.contract-position-fetcher';
import { PolygonSolaceTvlFetcher } from './polygon/solace.tvl-fetcher';
import { PolygonSolaceXslockerContractPositionFetcher } from './polygon/solace.xslocker.contract-position-fetcher';
import SOLACE_DEFINITION, { SolaceAppDefinition } from './solace.definition';

@Register.AppModule({
  appId: SOLACE_DEFINITION.id,
  providers: [
    EthereumSolaceBalanceFetcher,
    EthereumSolaceBondsContractPositionFetcher,
    EthereumSolacePoliciesContractPositionFetcher,
    EthereumSolaceScpTokenFetcher,
    EthereumSolaceTvlFetcher,
    EthereumSolaceXslockerContractPositionFetcher,
    EthereumSolaceXsolacev1TokenFetcher,
    PolygonSolaceBalanceFetcher,
    PolygonSolaceBondsContractPositionFetcher,
    PolygonSolacePoliciesContractPositionFetcher,
    PolygonSolaceTvlFetcher,
    PolygonSolaceXslockerContractPositionFetcher,
    SolaceAppDefinition,
    SolaceContractFactory,
  ],
})
export class SolaceAppModule extends AbstractApp() {}
