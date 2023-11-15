import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenDefinitionsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VestingEscrowTemplateContractPositionFetcher } from '~position/template/vesting-escrow.template-contract-position-fetcher';

import { CurveViemContractFactory } from '../contracts';
import { CurveVestingEscrow } from '../contracts/viem';
import { CurveVestingEscrowContract } from '../contracts/viem/CurveVestingEscrow';

@PositionTemplate()
export class EthereumCurveVestingEscrowContractPositionFetcher extends VestingEscrowTemplateContractPositionFetcher<CurveVestingEscrow> {
  groupLabel = 'Vesting Escrow';
  veTokenAddress = '0xd2d43555134dc575bf7279f4ba18809645db0f1d';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveViemContractFactory) protected readonly contractFactory: CurveViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): CurveVestingEscrowContract {
    return this.contractFactory.curveVestingEscrow({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<CurveVestingEscrow>) {
    return contract.read.token();
  }

  getLockedTokenBalance({ address, contract }: GetTokenBalancesParams<CurveVestingEscrow>) {
    return contract.read.lockedOf([address]);
  }

  getUnlockedTokenBalance({ address, contract }: GetTokenBalancesParams<CurveVestingEscrow>) {
    return contract.read.balanceOf([address]);
  }
}
