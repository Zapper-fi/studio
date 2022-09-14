import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';
import { SynthetixLoanContractPositionHelper } from '../helpers/synthetix.loan.contract-position-helper';

import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

const appId = SYNTHETIX_DEFINITION.id;
const groupId = SYNTHETIX_DEFINITION.groups.loan.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumSynthetixLoanContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(SynthetixLoanContractPositionHelper)
    private readonly synthetixLoanContractPositionHelper: SynthetixLoanContractPositionHelper,
  ) { }

  async getPositions() {
    const loanContractAddress = '0x5c8344bcdC38F1aB5EB5C1d4a35DdEeA522B5DfA';
    return this.synthetixLoanContractPositionHelper.getPositions({ loanContractAddress, network });
  }
}
