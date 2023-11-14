import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { compact, merge, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { UniswapV3LiquidityContractPositionBuilder } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-builder';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { RevertFinanceViemContractFactory } from '../contracts';
import { RevertFinanceCompoundor } from '../contracts/viem';

export abstract class RevertFinanceCompoundorContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<RevertFinanceCompoundor> {
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
    return `Compounding Position`;
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

    const positionBalances = await Promise.all(
      range(0, balance).map(async i => {
        const positionId = await multicall.wrap(compoundor).read.accountTokens([address, BigInt(i)]);

        const uniV3Token = await this.uniswapV3LiquidityContractPositionBuilder.buildPosition({
          positionId,
          multicall,
          tokenLoader,
          network: this.network,
          collapseClaimable: true,
        });

        if (!uniV3Token) return null;

        const positionBalance = merge({}, position, {
          balanceUSD: uniV3Token.balanceUSD,
          tokens: uniV3Token.tokens,
          dataProps: {
            positionId,
            positionKey: `${positionId}`,
          },
          displayProps: {
            label: `Compounding ${uniV3Token.displayProps.label}`,
            images: uniV3Token.displayProps.images,
            statsItems: [],
          },
        });

        return positionBalance;
      }),
    );

    return compact(positionBalances);
  }
}
