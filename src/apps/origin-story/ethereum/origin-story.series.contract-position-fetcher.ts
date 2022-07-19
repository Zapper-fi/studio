import { Inject } from '@nestjs/common';
import { BigNumber, ethers } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { OriginStoryContractFactory } from '../contracts';
import { ORIGIN_STORY_DEFINITION } from '../origin-story.definition';

const appId = ORIGIN_STORY_DEFINITION.id;
const groupId = ORIGIN_STORY_DEFINITION.groups.series.id;
const network = Network.ETHEREUM_MAINNET;

const OGN_ADDRESSES = {
  ethereum: '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26',
};

const SERIES_ADDRESSES = {
  ethereum: 'series.ognstaking.eth',
};

export type OriginStoryDetails = {
  seriesAddress: string;
  network: string;
};

export type OriginStoryContractPositionDataProps = {
  totalValueLocked: number;
};

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumOriginStorySeriesContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OriginStoryContractFactory) private readonly originStoryContractFactory: OriginStoryContractFactory,
  ) {}

  async getPositions() {
    const address = SERIES_ADDRESSES[network];

    // No staking contracts on network
    if (!address) {
      return [];
    }

    const series = this.originStoryContractFactory.series({
      address,
      network,
    });

    const tokens = await this.appToolkit.getBaseTokenPrices(network);
    const ogn = tokens.find(t => t.address === OGN_ADDRESSES[network]);

    // Unlikely to happen but makes TS happy
    if (!ogn) {
      return [];
    }

    const totalValueLocked = parseFloat(ethers.utils.formatUnits(await series.totalSupply()));

    const position: ContractPosition<OriginStoryContractPositionDataProps> = {
      type: ContractType.POSITION,
      appId,
      groupId,
      address,
      network,
      tokens: [ogn],
      dataProps: {
        totalValueLocked,
      },
      displayProps: {
        label: `Staked ${getLabelFromToken(ogn)}`,
        images: getImagesFromToken(ogn),
      },
    };

    return [position];
  }
}
