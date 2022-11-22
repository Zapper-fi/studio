import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenDefinitionsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VestingEscrowTemplateContractPositionFetcher } from '~position/template/vesting-escrow.template-contract-position-fetcher';

import { CurveContractFactory, CurveVestingEscrow } from '../contracts';

@PositionTemplate()
export class EthereumCurveVestingEscrowContractPositionFetcher extends VestingEscrowTemplateContractPositionFetcher<CurveVestingEscrow> {
  groupLabel = 'Vesting Escrow';
  veTokenAddress = '0x575ccd8e2d300e2377b43478339e364000318e2c';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): CurveVestingEscrow {
    return this.contractFactory.curveVestingEscrow({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<CurveVestingEscrow>) {
    return contract.token();
  }

  getLockedTokenBalance({ address, contract }: GetTokenBalancesParams<CurveVestingEscrow>) {
    return contract.lockedOf(address);
  }

  getUnlockedTokenBalance({ address, contract }: GetTokenBalancesParams<CurveVestingEscrow>) {
    return contract.balanceOf(address);
  }
}
