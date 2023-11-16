import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';
import { BigNumberish } from 'ethers';
import { range, sumBy, compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps, WithMetaType } from '~position/display.interface';
import {
  AppTokenPositionBalance,
  BaseTokenBalance,
  ContractPositionBalance,
} from '~position/position-balance.interface';
import { MetaType, Standard } from '~position/position.interface';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';
import { Network } from '~types';

import { GoldfinchViemContractFactory } from '../contracts';
import { GoldfinchStakingRewards } from '../contracts/viem';

export type GoldfinchStakingRewardsDataProps = {
  assetStandard: Standard;
};

export type GoldfinchStakingRewardsDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class EthereumGoldfinchStakingRewardsContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  GoldfinchStakingRewards,
  GoldfinchStakingRewardsDataProps,
  GoldfinchStakingRewardsDefinition
> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GoldfinchViemContractFactory) protected readonly contractFactory: GoldfinchViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.goldfinchStakingRewards({ address, network: this.network });
  }

  async getDefinitions() {
    const STAKING_REWARDS = '0xfd6ff39da508d281c2d255e9bbbfab34b6be60c3';
    const FIDU = '0x6a445e9f40e0b97c92d0b8a3366cef1d67f700bf';
    const CURVE_FIDU_USDC = '0x42ec68ca5c2c80036044f3eead675447ab3a8065';
    const GFI = '0xdab396ccf3d84cf2d07c4454e10c8a6f5b008d2b';
    return [
      {
        address: STAKING_REWARDS,
        underlyingTokenAddress: FIDU,
      },
      {
        address: STAKING_REWARDS,
        underlyingTokenAddress: CURVE_FIDU_USDC,
      },
      {
        address: STAKING_REWARDS,
        underlyingTokenAddress: GFI,
      },
    ];
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<GoldfinchStakingRewards, GoldfinchStakingRewardsDefinition>) {
    const GFI = '0xdab396ccf3d84cf2d07c4454e10c8a6f5b008d2b';
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.underlyingTokenAddress,
        network: Network.ETHEREUM_MAINNET,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: GFI,
        network: Network.ETHEREUM_MAINNET,
      },
    ];
  }

  async getDataProps() {
    return {
      assetStandard: Standard.ERC_721,
    };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<GoldfinchStakingRewards>) {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<GoldfinchStakingRewardsDataProps>[]> {
    const GFI = '0xdab396ccf3d84cf2d07c4454e10c8a6f5b008d2b';
    const FIDU = '0x6a445e9f40e0b97c92d0b8a3366cef1d67f700bf';
    const CURVE_FIDU_USDC = '0x42ec68ca5c2c80036044f3eead675447ab3a8065';
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const positions = await this.appToolkit.getAppContractPositions<GoldfinchStakingRewardsDataProps>({
      appId: this.appId,
      groupIds: [this.groupId],
      network: this.network,
    });

    const fiduPosition = positions.find(v => v.tokens[0].address === FIDU);
    const curveFiduUsdcPosition = positions.find(v => v.tokens[0].address === CURVE_FIDU_USDC);
    const gfiPosition = positions.find(v => v.tokens[0].address === GFI);

    if (!fiduPosition || !curveFiduUsdcPosition || !gfiPosition) return [];

    const stakingRewardsContract = this.contractFactory.goldfinchStakingRewards({
      address: fiduPosition.address,
      network: this.network,
    });
    const balanceRaw = await multicall.wrap(stakingRewardsContract).read.balanceOf([address]);
    const balance = Number(balanceRaw);
    if (balance === 0) return [];

    const claimableGFI = await multicall.wrap(stakingRewardsContract).read.totalOptimisticClaimable([address]);
    const claimableGFITokens = [drillBalance(gfiPosition.tokens[1], claimableGFI.toString())];
    const claimableGFIBalanceUSD = sumBy(claimableGFITokens, v => v.balanceUSD);
    const claimableGFIContractPositionBalance = {
      ...gfiPosition,
      tokens: claimableGFITokens,
      balanceUSD: claimableGFIBalanceUSD,
    };

    let sumOfCurveTotalTokens = new BigNumber(0);
    let sumOfFiduTotalTokens = new BigNumber(0);

    // Loop through all the user's positions, and sum up the total number of FIDU & CurveLP tokens
    await Promise.all(
      range(0, balance).map(async i => {
        const tokenId = await multicall.wrap(stakingRewardsContract).read.tokenOfOwnerByIndex([address, BigInt(i)]);
        const positionData = await multicall.wrap(stakingRewardsContract).read.positions([tokenId]);
        const amount = positionData[0];
        const positionType = positionData[4];

        if (positionType !== 0 && positionType !== 1) return null;

        if (positionType === 1) {
          sumOfCurveTotalTokens = sumOfCurveTotalTokens.plus(amount.toString());
        } else if (positionType === 0) {
          sumOfFiduTotalTokens = sumOfFiduTotalTokens.plus(amount.toString());
        }
      }),
    );

    let tokens: (WithMetaType<BaseTokenBalance> | WithMetaType<AppTokenPositionBalance<DefaultDataProps>>)[];
    let balanceUSD: number;
    tokens = [drillBalance(curveFiduUsdcPosition.tokens[0], sumOfCurveTotalTokens.toString())];
    balanceUSD = sumBy(tokens, v => v.balanceUSD);
    const curveTotalPositionBalance: ContractPositionBalance<GoldfinchStakingRewardsDataProps> = {
      ...curveFiduUsdcPosition,
      tokens,
      balanceUSD,
    };

    tokens = [drillBalance(fiduPosition.tokens[0], sumOfFiduTotalTokens.toString())];
    balanceUSD = sumBy(tokens, v => v.balanceUSD);
    const fiduTotalPositionBalance: ContractPositionBalance<GoldfinchStakingRewardsDataProps> = {
      ...fiduPosition,
      tokens,
      balanceUSD,
    };

    return compact([curveTotalPositionBalance, fiduTotalPositionBalance, claimableGFIContractPositionBalance]).filter(
      v => v.balanceUSD > 0,
    );
  }
}
