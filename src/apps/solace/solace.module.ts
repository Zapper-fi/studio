import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

// General
import { AuroraSolaceBalanceFetcher } from './aurora/solace.balance-fetcher';
import { AuroraSolaceBondsContractPositionFetcher } from './aurora/solace.bonds.contract-position-fetcher';
import { AuroraSolacePoliciesContractPositionFetcher } from './aurora/solace.policies.contract-position-fetcher';
import { AuroraSolaceXslockerContractPositionFetcher } from './aurora/solace.xslocker.contract-position-fetcher';
import { SolaceContractFactory } from './contracts';
// Helpers
// Ethereum
import { EthereumSolaceBalanceFetcher } from './ethereum/solace.balance-fetcher';
import { EthereumSolaceBondsContractPositionFetcher } from './ethereum/solace.bonds.contract-position-fetcher';
import { EthereumSolacePoliciesContractPositionFetcher } from './ethereum/solace.policies.contract-position-fetcher';
import { EthereumSolaceScpTokenFetcher } from './ethereum/solace.scp.token-fetcher';
import { EthereumSolaceXslockerContractPositionFetcher } from './ethereum/solace.xslocker.contract-position-fetcher';
import { EthereumSolaceXsolacev1TokenFetcher } from './ethereum/solace.xsolacev1.token-fetcher';
// Aurora
// Polygon
// Fantom
import { FantomSolaceBalanceFetcher } from './fantom/solace.balance-fetcher';
import { FantomSolaceBondsContractPositionFetcher } from './fantom/solace.bonds.contract-position-fetcher';
import { FantomSolacePoliciesContractPositionFetcher } from './fantom/solace.policies.contract-position-fetcher';
import { FantomSolaceXslockerContractPositionFetcher } from './fantom/solace.xslocker.contract-position-fetcher';
import { SolaceBondBalanceHelper } from './helpers/SolaceBondBalanceHelper';
import { SolacePolicyBalanceHelper } from './helpers/SolacePolicyBalanceHelper';
import { SolaceXSBalanceHelper } from './helpers/SolaceXSBalanceHelper';
import { PolygonSolaceBalanceFetcher } from './polygon/solace.balance-fetcher';
import { PolygonSolaceBondsContractPositionFetcher } from './polygon/solace.bonds.contract-position-fetcher';
import { PolygonSolacePoliciesContractPositionFetcher } from './polygon/solace.policies.contract-position-fetcher';
import { PolygonSolaceXslockerContractPositionFetcher } from './polygon/solace.xslocker.contract-position-fetcher';
import SOLACE_DEFINITION, { SolaceAppDefinition } from './solace.definition';

@Register.AppModule({
  appId: SOLACE_DEFINITION.id,
  providers: [
    // General
    SolaceAppDefinition,
    SolaceContractFactory,
    // Helpers
    SolaceBondBalanceHelper,
    SolacePolicyBalanceHelper,
    SolaceXSBalanceHelper,
    // Ethereum
    EthereumSolaceBalanceFetcher,
    EthereumSolaceBondsContractPositionFetcher,
    EthereumSolacePoliciesContractPositionFetcher,
    EthereumSolaceScpTokenFetcher,
    EthereumSolaceXslockerContractPositionFetcher,
    EthereumSolaceXsolacev1TokenFetcher,
    // Aurora
    AuroraSolaceBalanceFetcher,
    AuroraSolaceBondsContractPositionFetcher,
    AuroraSolacePoliciesContractPositionFetcher,
    AuroraSolaceXslockerContractPositionFetcher,
    // Polygon
    PolygonSolaceBalanceFetcher,
    PolygonSolaceBondsContractPositionFetcher,
    PolygonSolacePoliciesContractPositionFetcher,
    PolygonSolaceXslockerContractPositionFetcher,
    // Fantom
    FantomSolaceBalanceFetcher,
    FantomSolaceBondsContractPositionFetcher,
    FantomSolacePoliciesContractPositionFetcher,
    FantomSolaceXslockerContractPositionFetcher,
  ],
})
export class SolaceAppModule extends AbstractApp() {}
