import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SynthetixHoldersHelper } from '../helpers/synthetix.holders.helpers';
import { SynthetixMintrContractPositionHelper } from '../helpers/synthetix.mintr.contract-position-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

const appId = SYNTHETIX_DEFINITION.id;
const groupId = SYNTHETIX_DEFINITION.groups.mintr.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { excludeFromTvl: true } })
export class EthereumSynthetixMintrContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(SynthetixMintrContractPositionHelper)
    private readonly synthetixMintrContractPositionHelper: SynthetixMintrContractPositionHelper,
    @Inject(SynthetixHoldersHelper) private readonly synthetixHoldersHelper: SynthetixHoldersHelper,
  ) {}

  @CacheOnInterval({
    key: `studio:${SYNTHETIX_DEFINITION.id}:${Network.ETHEREUM_MAINNET}:snx-holders`,
    timeout: 15 * 60 * 1000,
  })
  private async cacheSynthetixHolders() {
    return this.synthetixHoldersHelper.getCacheSynthetixHolders({ network });
  }

  async getPositions() {
    const holders = await this.cacheSynthetixHolders();

    return this.synthetixMintrContractPositionHelper.getPositions({ holders, network });
  }
}
