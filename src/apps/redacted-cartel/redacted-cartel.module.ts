import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { EthereumRedactedCartelBondContractPositionFetcher } from './ethereum/redacted-cartel.bond.contract-position-fetcher';
import { EthereumRedactedCartelWxBtrflyV1TokenFetcher } from './ethereum/redacted-cartel.wx-btrfly-v1.token-fetcher';
import { EthereumRedactedCartelWxBtrflyTokenFetcher } from './ethereum/redacted-cartel.wx-btrfly.token-fetcher';
import { EthereumRedactedCartelXBtrflyTokenFetcher } from './ethereum/redacted-cartel.x-btrfly.token-fetcher';
import { RedactedCartelAppDefinition, REDACTED_CARTEL_DEFINITION } from './redacted-cartel.definition';

@Register.AppModule({
  appId: REDACTED_CARTEL_DEFINITION.id,
  providers: [
    RedactedCartelAppDefinition,
    EthereumRedactedCartelXBtrflyTokenFetcher,
    EthereumRedactedCartelWxBtrflyTokenFetcher,
    EthereumRedactedCartelWxBtrflyV1TokenFetcher,
    EthereumRedactedCartelBondContractPositionFetcher,
  ],
})
export class RedactedCartelAppModule extends AbstractApp() {}
