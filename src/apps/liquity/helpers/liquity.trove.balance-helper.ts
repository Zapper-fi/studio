import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionBalance } from '~position/position-balance.interface';
import { borrowed, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { LiquityContractFactory } from '../contracts';

@Injectable()
export class LiquityTroveBalanceHelper {
  constructor(
    @Inject(LiquityContractFactory)
    private readonly liquityContractFactory: LiquityContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getTroveBalances({
    address,
    network,
    appId,
    groupId,
    troveManagerAddress,
    collateralTokenSymbol,
    debtTokenSymbol,
  }: {
    address: string;
    network: Network;
    appId: string;
    groupId: string;
    troveManagerAddress: string;
    collateralTokenSymbol: string;
    debtTokenSymbol: string;
  }) {
    const multicall = this.appToolkit.getMulticall(network);

    const liquityTroveContract = this.liquityContractFactory.troveManager({ address: troveManagerAddress, network });

    const prices = await this.appToolkit.getBaseTokenPrices(network);
    const collateralToken = prices.find(p => p.symbol === collateralTokenSymbol)!;
    const debtToken = prices.find(p => p.symbol === debtTokenSymbol)!;

    const [collateralBalanceRaw, borrowBalanceRaw] = await Promise.all([
      multicall.wrap(liquityTroveContract).getTroveColl(address),
      multicall.wrap(liquityTroveContract).getTroveDebt(address),
    ]);

    const collateralTokenBalance = drillBalance(supplied(collateralToken), collateralBalanceRaw.toString());
    const debtTokenBalance = drillBalance(borrowed(debtToken), borrowBalanceRaw.toString(), {
      isDebt: true,
    });
    const tokens = [collateralTokenBalance, debtTokenBalance];

    const contractPositionBalance: PositionBalance = {
      type: ContractType.POSITION,
      network,
      address: troveManagerAddress,
      appId,
      groupId,
      tokens: tokens,
      balanceUSD: _.sumBy(tokens, t => t.balanceUSD),
      dataProps: {},
      displayProps: {
        label: appId,
        images: tokens.map(t => getTokenImg(t.address, t.network)),
      },
    };

    return [contractPositionBalance];
  }
}
