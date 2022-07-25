import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { OriginDollarContractFactory } from '../contracts';
import { ORIGIN_DOLLAR_DEFINITION } from '../origin-dollar.definition';

const appId = ORIGIN_DOLLAR_DEFINITION.id;
const groupId = ORIGIN_DOLLAR_DEFINITION.groups.rewards.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumOriginDollarRewardsContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OriginDollarContractFactory) private readonly originDollarContractFactory: OriginDollarContractFactory,
  ) {}

  async getPositions() {
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: 'origin-dollar',
      groupIds: ['veogv'],
      network,
    });

    const ogv = appTokens.find(v => v.address === '0x0c4576ca1c365868e162554af8e385dc3e7c66d9');

    if (!ogv) {
      return [];
    }

    const position: ContractPosition = {
      type: ContractType.POSITION,
      appId,
      groupId,
      address: ogv.address,
      network,
      tokens: [...appTokens],
      dataProps: {},
      displayProps: {
        label: `${getLabelFromToken(ogv)} Staking Rewards`,
        images: getImagesFromToken(ogv),
      },
    };

    return [position];
  }
}
