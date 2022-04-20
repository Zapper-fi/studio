import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionBalance } from '~position/position-balance.interface';
import { claimable, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { LiquityContractFactory } from '../contracts';

@Injectable()
export class LiquityStabilityPoolBalanceHelper {
  constructor(
    @Inject(LiquityContractFactory)
    private readonly liquityContractFactory: LiquityContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getStabilityPoolBalances({
    address,
    appId,
    groupId,
    network,
    stabilityPoolAddress,
    collateralTokenSymbol,
    debtTokenSymbol,
    govTokenSymbol,
  }: {
    address: string;
    appId: string;
    groupId: string;
    network: Network;
    stabilityPoolAddress: string;
    collateralTokenSymbol: string;
    debtTokenSymbol: string;
    govTokenSymbol: string;
  }): Promise<PositionBalance[]> {
    const multicall = this.appToolkit.getMulticall(network);

    const liquityStabilityPoolContract = this.liquityContractFactory.stabilityPool({
      address: stabilityPoolAddress,
      network,
    });
    const prices = await this.appToolkit.getBaseTokenPrices(network);
    const collateralToken = prices.find(p => p.symbol === collateralTokenSymbol)!;
    const debtToken = prices.find(p => p.symbol === debtTokenSymbol)!;
    const govToken = prices.find(p => p.symbol === govTokenSymbol)!;

    const [depositBalanceRaw, ethGainBalanceRaw, lqtyGainBalanceRaw] = await Promise.all([
      multicall.wrap(liquityStabilityPoolContract).getCompoundedLUSDDeposit(address),
      multicall.wrap(liquityStabilityPoolContract).getDepositorETHGain(address),
      multicall.wrap(liquityStabilityPoolContract).getDepositorLQTYGain(address),
    ]);

    const depositedLUSDBalance = drillBalance(supplied(debtToken), depositBalanceRaw.toString());
    const claimableETHBalance = drillBalance(claimable(collateralToken), ethGainBalanceRaw.toString());
    const claimableLQTYBalance = drillBalance(claimable(govToken), lqtyGainBalanceRaw.toString());
    const tokens = [depositedLUSDBalance, claimableETHBalance, claimableLQTYBalance];

    const contractPositionBalance: PositionBalance = {
      type: ContractType.POSITION,
      network,
      address: stabilityPoolAddress,
      appId,
      groupId,
      tokens: tokens,
      balanceUSD: _.sumBy(tokens, t => t.balanceUSD),
      dataProps: {},
      displayProps: {
        label: appId,
        images: [getAppImg(appId)],
      },
    };

    return [contractPositionBalance];
  }
}
