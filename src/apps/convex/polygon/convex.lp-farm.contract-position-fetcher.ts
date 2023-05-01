import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { ConvexContractFactory } from '../contracts';
import { ConvexRewardPool } from '../contracts/ethers';

export type ConvexLpFarmDefinition = {
  address: string;
  lpTokenAddress: string;
  rewardAddresses: string[];
};

@PositionTemplate()
export class PolygonConvexLpFarmContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  ConvexRewardPool,
  DefaultDataProps,
  ConvexLpFarmDefinition
> {
  groupLabel = 'Liqudity Pool Staking';

  boosterContractAddress = '0xf403c135812408bfbe8713b5a23a04b3d48aae31';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConvexContractFactory) protected readonly contractFactory: ConvexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ConvexRewardPool {
    return this.contractFactory.convexRewardPool({ address, network: this.network });
  }

  async getDefinitions(): Promise<ConvexLpFarmDefinition[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const depositContract = this.contractFactory.convexBoosterSidechain({
      address: this.boosterContractAddress,
      network: this.network,
    });
    const numPools = await multicall.wrap(depositContract).poolLength().then(Number);
    return Promise.all(
      range(0, numPools).map(async v => {
        const pool = await multicall.wrap(depositContract).poolInfo(v);
        const address = pool.rewards.toLowerCase();

        const convexRewardPoolContract = this.contractFactory.convexRewardPool({
          address,
          network: this.network,
        });
        const rewardLength = await multicall.wrap(convexRewardPoolContract).rewardLength();
        const rewardAddresses = await Promise.all(
          range(0, Number(rewardLength)).map(v =>
            multicall
              .wrap(convexRewardPoolContract)
              .rewards(v)
              .then(p => p.reward_token.toLowerCase()),
          ),
        );

        return {
          address: pool.rewards.toLowerCase(),
          lpTokenAddress: pool.lptoken.toLowerCase(),
          rewardAddresses: [rewardAddresses[0]],
        };
      }),
    );
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<ConvexRewardPool, ConvexLpFarmDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.lpTokenAddress,
        network: this.network,
      },
      ...definition.rewardAddresses.map(address => ({
        metaType: MetaType.CLAIMABLE,
        address,
        network: this.network,
      })),
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<ConvexRewardPool>) {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    return getLabelFromToken(stakedToken);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<ConvexRewardPool>) {
    const deposit = await contract.balanceOf(address);

    const rewards = await contract.callStatic.earned(address);
    const rewardBalances = rewards.map(rewardToken => {
      return Number(rewardToken.amount);
    });

    return [deposit, ...rewardBalances];
  }
}
