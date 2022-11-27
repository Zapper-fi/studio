import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CurveVotingEscrowContractPositionBalanceHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-balance-helper';
import { CurveVotingEscrowContractPositionHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-helper';

import { MahadaoContractFactory } from './contracts';
import { EthereumMahadaoBalanceFetcher } from './ethereum/mahadao.balance-fetcher';
import { EthereumMahadaoLockerContractPositionFetcher } from './ethereum/mahadao.locker.contract-position-fetcher';
import { MahadaoAppDefinition, MAHADAO_DEFINITION } from './mahadao.definition';

@Register.AppModule({
  appId: MAHADAO_DEFINITION.id,
  providers: [
    MahadaoAppDefinition,
    MahadaoContractFactory,
    CurveVotingEscrowContractPositionBalanceHelper,
    CurveVotingEscrowContractPositionHelper,
    EthereumMahadaoBalanceFetcher,
    EthereumMahadaoLockerContractPositionFetcher,
  ],
})
export class MahadaoAppModule extends AbstractApp() {}
