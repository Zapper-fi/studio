import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CurveVotingEscrowContractPositionBalanceHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-balance-helper';
import { CurveVotingEscrowContractPositionHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-helper';

import { AngleAppDefinition, ANGLE_DEFINITION } from './angle.definition';
import { AngleContractFactory } from './contracts';
import { EthereumAngleBalanceFetcher } from './ethereum/angle.balance-fetcher';
import { EthereumAnglePerpetualsContractPositionFetcher } from './ethereum/angle.perpetuals.contract-position-fetcher';
import { EthereumAngleSantokenTokenFetcher } from './ethereum/angle.santoken.token-fetcher';
import { EthereumAngleVaultsContractPositionFetcher } from './ethereum/angle.vaults.contract-position-fetcher';
import { EthereumAngleVeAngleContractPositionFetcher } from './ethereum/angle.veangle.contract-position-fetcher';
import { AngleApiHelper } from './helpers/angle.api';

@Register.AppModule({
  appId: ANGLE_DEFINITION.id,
  providers: [
    AngleAppDefinition,
    AngleContractFactory,
    // Helpers
    AngleApiHelper,
    CurveVotingEscrowContractPositionHelper,
    CurveVotingEscrowContractPositionBalanceHelper,
    // Ethereum
    EthereumAngleSantokenTokenFetcher,
    EthereumAngleVeAngleContractPositionFetcher,
    EthereumAngleBalanceFetcher,
    EthereumAnglePerpetualsContractPositionFetcher,
    EthereumAngleVaultsContractPositionFetcher,
  ],
})
export class AngleAppModule extends AbstractApp() {}
