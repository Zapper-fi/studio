import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition, Token } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { ThalesContractFactory } from '../contracts';
import { THALES_DEFINITION } from '../thales.definition';

export type ThalesStakingContractPositionDataProps = {
  totalValueLocked: number;
};

const appId = THALES_DEFINITION.id;
const groupId = THALES_DEFINITION.groups.pool2.id;
const network = Network.OPTIMISM_MAINNET;

const farmDefinitions = [
  {
    address: '0x31a20E5b7b1b067705419D57Ab4F72E81cC1F6Bf'.toLowerCase(),
    stakedTokenAddress: '0xac6705bc7f6a35eb194bdb89066049d6f1b0b1b5'.toLowerCase(),
    rewardTokenAddress: '0x217d47011b23bb961eb6d93ca9945b7501a5bb11'.toLowerCase(),
  },
];

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismThalesPool2ContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ThalesContractFactory) private readonly thalesContractFactory: ThalesContractFactory,
  ) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({ appId: 'sorbet', groupIds: ['pool'], network });
    const allTokens = [...appTokens, ...baseTokens];
    const multicall = this.appToolkit.getMulticall(network);

    const positions = await Promise.all(
      farmDefinitions.map(async ({ address, stakedTokenAddress, rewardTokenAddress }) => {
        const stakedToken = allTokens.find(t => t.address === stakedTokenAddress);
        const rewardToken = allTokens.find(t => t.address === rewardTokenAddress);

        if (!stakedToken || !rewardToken) return null;
        const tokens = [supplied(stakedToken as Token), claimable(rewardToken)];
        const contract = this.thalesContractFactory.lpStaking({ address: farmDefinitions[0].address, network });
        const [balanceRaw] = await Promise.all([multicall.wrap(contract).totalSupply()]);
        const totalValueLocked = Number(balanceRaw) / 10 ** stakedToken.decimals;
        const label = `Staked ${getLabelFromToken(stakedToken)}`;
        // For images, we'll use the underlying token images as well
        const images = getImagesFromToken(stakedToken);
        // For the secondary label, we'll use the price of the jar token
        const secondaryLabel = buildDollarDisplayItem(stakedToken.price);

        const position: ContractPosition = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address,
          network,
          tokens,
          dataProps: {
            totalValueLocked,
          },
          displayProps: {
            label,
            images,
            secondaryLabel,
          },
        };

        return position;
      }),
    );
    return _.compact(positions);
  }
}
