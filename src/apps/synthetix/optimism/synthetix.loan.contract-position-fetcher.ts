import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SynthetixLoanContractPositionHelper } from '../helpers/synthetix.loan.contract-position-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

const appId = SYNTHETIX_DEFINITION.id;
const groupId = SYNTHETIX_DEFINITION.groups.loan.id;
const network = Network.OPTIMISM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismSynthetixLoanContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(SynthetixLoanContractPositionHelper)
    private readonly synthetixLoanContractPositionHelper: SynthetixLoanContractPositionHelper,
  ) {}

  async getPositions() {
    const loanContractAddress = '0x308ad16ef90fe7cacb85b784a603cb6e71b1a41a';
    return this.synthetixLoanContractPositionHelper.getPositions({ loanContractAddress, network });
  }
}
