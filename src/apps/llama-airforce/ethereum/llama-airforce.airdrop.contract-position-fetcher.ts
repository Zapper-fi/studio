import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { LLAMA_AIRFORCE_DEFINITION } from '../llama-airforce.definition';

const appId = LLAMA_AIRFORCE_DEFINITION.id;
const groupId = LLAMA_AIRFORCE_DEFINITION.groups.airdrop.id;
const network = Network.ETHEREUM_MAINNET;

const MERKLE_CLAIM_ADDRESS = '0xa83043df401346a67eddeb074679b4570b956183';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumLlamaAirforceAirdropContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions(): Promise<ContractPosition[]> {
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: LLAMA_AIRFORCE_DEFINITION.id,
      groupIds: [LLAMA_AIRFORCE_DEFINITION.groups.vault.id],
      network,
    });

    const rewardToken = appTokens.find(v => v.symbol === 'uCRV');
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
