import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AngleAppDefinition, ANGLE_DEFINITION } from './angle.definition';
import { AngleApiHelper } from './common/angle.api';
import { AngleContractFactory } from './contracts';
import { EthereumAnglePerpetualsContractPositionFetcher } from './ethereum/angle.perpetuals.contract-position-fetcher';
import { EthereumAngleSantokenTokenFetcher } from './ethereum/angle.santoken.token-fetcher';
import { EthereumAngleVaultsContractPositionFetcher } from './ethereum/angle.vaults.contract-position-fetcher';
import { EthereumAngleVeAngleContractPositionFetcher } from './ethereum/angle.veangle.contract-position-fetcher';

@Register.AppModule({
  appId: ANGLE_DEFINITION.id,
  providers: [
    AngleAppDefinition,
    AngleContractFactory,
    AngleApiHelper,
    // Ethereum
    EthereumAngleSantokenTokenFetcher,
    EthereumAngleVeAngleContractPositionFetcher,
    EthereumAnglePerpetualsContractPositionFetcher,
    EthereumAngleVaultsContractPositionFetcher,
  ],
})
export class AngleAppModule extends AbstractApp() {}
