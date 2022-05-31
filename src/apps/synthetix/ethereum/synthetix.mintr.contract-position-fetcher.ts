import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SynthetixMintrContractPositionHelper } from '../helpers/synthetix.mintr.contract-position-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

const appId = SYNTHETIX_DEFINITION.id;
const groupId = SYNTHETIX_DEFINITION.groups.mintr.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumSynthetixMintrContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(SynthetixMintrContractPositionHelper)
    private readonly synthetixMintrContractPositionHelper: SynthetixMintrContractPositionHelper,
  ) {}

  async getPositions() {
    return this.synthetixMintrContractPositionHelper.getPositions({ network });
  }
}
