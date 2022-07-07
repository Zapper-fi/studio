import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AngleAppDefinition, ANGLE_DEFINITION } from './angle.definition';
import { AngleContractFactory } from './contracts';
import { EthereumAngleBalanceFetcher } from './ethereum/angle.balance-fetcher';
import { EthereumAnglePerpetualsContractPositionFetcher } from './ethereum/angle.perpetuals.contract-position-fetcher';
import { EthereumAngleSantokenTokenFetcher } from './ethereum/angle.santoken.token-fetcher';
import { EthereumAngleVaultsContractPositionFetcher } from './ethereum/angle.vaults.contract-position-fetcher';
import { EthereumAngleVeAngleTokenFetcher } from './ethereum/angle.veangle.token-fetcher';

@Register.AppModule({
  appId: ANGLE_DEFINITION.id,
  providers: [
    AngleAppDefinition,
    AngleContractFactory,
    EthereumAngleSantokenTokenFetcher,
    EthereumAngleVeAngleTokenFetcher,
    EthereumAngleBalanceFetcher,
    EthereumAnglePerpetualsContractPositionFetcher,
    EthereumAngleVaultsContractPositionFetcher,
  ],
})
export class AngleAppModule extends AbstractApp() {}
