import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { compact, merge, range, sumBy, uniqBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { UniswapV3LiquidityContractPositionBuilder } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-builder';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { claimable } from '~position/position.utils';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { RevertFinanceViemContractFactory } from '../contracts';
import { RevertFinanceCompoundor } from '../contracts/viem';

export abstract class RevertFinanceCompoundorRewardsContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<RevertFinanceCompoundor> {
  isExcludedFromExplore = true;

  abstract compoundorAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RevertFinanceViemContractFactory) protected readonly contractFactory: RevertFinanceViemContractFactory,
    @Inject(UniswapV3LiquidityContractPositionBuilder)
    protected readonly uniswapV3LiquidityContractPositionBuilder: UniswapV3LiquidityContractPositionBuilder,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.revertFinanceCompoundor({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: this.compoundorAddress }];
  }

  async getTokenDefinitions() {
    return [];
  }

  async getLabel(): Promise<string> {
    return `Compounding Position Rewards`;
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const tokenLoader = this.appToolkit.getTokenDependencySelector();

    const [position] = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      groupIds: [this.groupId],
      network: this.network,
    });

    if (!position) return [];

    const compoundor = this.contractFactory.revertFinanceCompoundor({
      address: this.compoundorAddress,
      network: this.network,
    });

    const balanceRaw = await compoundor.read.balanceOf([address]);
    const balance = Number(balanceRaw);
    if (balance === 0) return [];

    const maybeTokens = await Promise.all(
      range(0, balance).map(async i => {
        const positionId = await multicall.wrap(compoundor).read.accountTokens([address, BigInt(i)]);
        return this.uniswapV3LiquidityContractPositionBuilder.getTokensForPosition({
          positionId,
          multicall,
          tokenLoader,
          network: this.network,
        });
      }),
    );

    const tokens = compact(maybeTokens.flat());
    const uniqueTokens = uniqBy(tokens, v => v.address);
    const tokenBalances = await Promise.all(
      uniqueTokens.map(async token => {
        const balanceRaw = await multicall.wrap(compoundor).read.accountBalances([address, token.address]);
        return drillBalance(claimable(token), balanceRaw.toString());
      }),
    );

    const nonZeroBalances = tokenBalances.filter(v => v.balanceUSD > 0);
    const positionBalance = merge({}, position, {
      balanceUSD: sumBy(nonZeroBalances, v => v.balanceUSD),
      tokens: nonZeroBalances,
      displayProps: {
        label: `Compoundor Claimable Fees`,
        images: nonZeroBalances.flatMap(v => getImagesFromToken(v)),
        statsItems: [],
      },
    });

    return [positionBalance];
  }
}
