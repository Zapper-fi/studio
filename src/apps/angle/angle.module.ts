import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AngleAppDefinition, ANGLE_DEFINITION } from './angle.definition';
import { AngleApiHelper } from './common/angle.api';
import { AngleContractFactory } from './contracts';
import { EthereumAnglePerpetualsContractPositionFetcher } from './ethereum/angle.perpetual.contract-position-fetcher';
import { EthereumAngleSanTokenTokenFetcher } from './ethereum/angle.san-token.token-fetcher';
import { EthereumAngleVaultsContractPositionFetcher } from './ethereum/angle.vault.contract-position-fetcher';
import { EthereumAngleVeAngleContractPositionFetcher } from './ethereum/angle.voting-escrow.contract-position-fetcher';

@Register.AppModule({
  appId: ANGLE_DEFINITION.id,
  providers: [
    AngleAppDefinition,
    AngleContractFactory,
    AngleApiHelper,
    // Ethereum
    EthereumAngleSanTokenTokenFetcher,
    EthereumAngleVeAngleContractPositionFetcher,
    EthereumAnglePerpetualsContractPositionFetcher,
    EthereumAngleVaultsContractPositionFetcher,
  ],
})
export class AngleAppModule extends AbstractApp() {}
