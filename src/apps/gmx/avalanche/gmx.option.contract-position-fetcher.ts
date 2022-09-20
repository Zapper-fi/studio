import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import GMX_DEFINITION from '../gmx.definition';
import { GmxOptionContractPositionHelper } from '../helpers/gmx.option.contract-position-helper';

const appId = GMX_DEFINITION.id;
const groupId = GMX_DEFINITION.groups.option.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheOptionsFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(GmxOptionContractPositionHelper)
    private readonly gmxOptionContractPositionHelper: GmxOptionContractPositionHelper,
  ) {}

  async getPositions() {
    const vaultAddress = '0x9ab2de34a33fb459b538c43f251eb825645e8595';
    return this.gmxOptionContractPositionHelper.getPosition({ network, vaultAddress });
  }
}
