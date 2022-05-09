import { Inject } from '@nestjs/common';
import _, { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition, Token } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { AbstractToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { ThalesContractFactory } from '../contracts';
import { THALES_DEFINITION } from '../thales.definition';

const appId = THALES_DEFINITION.id;
const groupId = THALES_DEFINITION.groups.staking.id;
const network = Network.OPTIMISM_MAINNET;

export type ThalesStakingContractPositionDataProps = {
  totalValueLocked: number;
};


const farmDefinitions = [{
  address: '0xC392133eEa695603B51a5d5de73655d571c2CE51'.toLowerCase(),
  stakedTokenAddress: '0x217d47011b23bb961eb6d93ca9945b7501a5bb11'.toLowerCase(),
  rewardTokenAddress: '0x217d47011b23bb961eb6d93ca9945b7501a5bb11'.toLowerCase(),
}];

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismThalesStakingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ThalesContractFactory) private readonly thalesContractFactory: ThalesContractFactory,
  ) { }

  async getPositions() {
    // const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    // const appTokens = await this.appToolkit.getAppTokenPositions(
    //   { appId: 'thales', groupIds: ['staking'], network },
    // );
    // const allTokens = [...appTokens, ...baseTokens];

    const multicall = this.appToolkit.getMulticall(network);

    const tokens = await farmDefinitions.map(async ({ address, stakedTokenAddress, rewardTokenAddress }) => {
      const stakedToken: Token = {
        address: '0x217d47011b23bb961eb6d93ca9945b7501a5bb11'.toLowerCase(),
        network,
        price: 0.42,
        symbol: "THALES",
        decimals: 18,
        type: ContractType.BASE_TOKEN,
      };

      const rewardToken: Token = {
        address: '0x217d47011b23bb961eb6d93ca9945b7501a5bb11'.toLowerCase(),
        network,
        price: 0.42,
        symbol: "THALES",
        decimals: 18,
        type: ContractType.BASE_TOKEN,
      };

      // const rewardToken = allTokens.find(v => v.address === rewardTokenAddress);
      if (!stakedToken || !rewardToken) return null;

      const tokens = [supplied(stakedToken as Token), claimable(rewardToken)];
      const contract = this.thalesContractFactory.stakingThales({ address: farmDefinitions[0].address, network });
      const [balanceRaw] = await Promise.all([multicall.wrap(contract).stakedBalanceOf(address)]);
      console.log(`balance`, balanceRaw)
      const totalValueLocked = Number(balanceRaw) / 10 ** stakedToken.decimals;

      const label = `Staked ${getLabelFromToken(stakedToken)}`;
      // For images, we'll use the underlying token images as well
      const images = getImagesFromToken(stakedToken);
      // For the secondary label, we'll use the price of the jar token
      const secondaryLabel = buildDollarDisplayItem(stakedToken.price);

      const position: ContractPosition<ThalesStakingContractPositionDataProps> = {
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
        }
      };

      return position;
    });

    return compact(tokens);
  }
}
