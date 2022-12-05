import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { RedactedCartelContractFactory } from './contracts';
import { EthereumRedactedCartelBondContractPositionFetcher } from './ethereum/redacted-cartel.bond.contract-position-fetcher';
import { EthereumRedactedCartelRevenueLockContractPositionFetcher } from './ethereum/redacted-cartel.revenue-lock.contract-position-fetcher';
import { EthereumRedactedCartelWxBtrflyV1TokenFetcher } from './ethereum/redacted-cartel.wx-btrfly-v1.token-fetcher';
import { EthereumRedactedCartelWxBtrflyTokenFetcher } from './ethereum/redacted-cartel.wx-btrfly.token-fetcher';
import { EthereumRedactedCartelXBtrflyTokenFetcher } from './ethereum/redacted-cartel.x-btrfly.token-fetcher';
import { RedactedCartelAppDefinition, REDACTED_CARTEL_DEFINITION } from './redacted-cartel.definition';

@Register.AppModule({
  appId: REDACTED_CARTEL_DEFINITION.id,
  providers: [
    RedactedCartelAppDefinition,
    RedactedCartelContractFactory,
    EthereumRedactedCartelXBtrflyTokenFetcher,
    EthereumRedactedCartelWxBtrflyTokenFetcher,
    EthereumRedactedCartelWxBtrflyV1TokenFetcher,
    EthereumRedactedCartelBondContractPositionFetcher,
    EthereumRedactedCartelRevenueLockContractPositionFetcher,
  ],
})
export class RedactedCartelAppModule extends AbstractApp() {}
