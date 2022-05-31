import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { OPTIMISM_DEFINITION } from '../optimism.definition';

const appId = OPTIMISM_DEFINITION.id;
const groupId = OPTIMISM_DEFINITION.groups.airdrop.id;
const network = Network.OPTIMISM_MAINNET;

const MERKLE_CLAIM_ADDRESS = '0xfedfaf1a10335448b7fa0268f56d2b44dbd357de';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismOptimismAirdropContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const rewardToken = baseTokens.find(v => v.symbol === 'OP');
    if (!rewardToken) return [];

    const contractPositionBalance: ContractPosition = {
      type: ContractType.POSITION,
      address: MERKLE_CLAIM_ADDRESS,
      appId,
      groupId,
      network,
      tokens: [claimable(rewardToken)],
      dataProps: {},
      displayProps: {
        label: `Claimable ${getLabelFromToken(rewardToken)}`,
        secondaryLabel: buildDollarDisplayItem(rewardToken.price),
        images: getImagesFromToken(rewardToken),
      },
    };

    return [contractPositionBalance];
  }
}
