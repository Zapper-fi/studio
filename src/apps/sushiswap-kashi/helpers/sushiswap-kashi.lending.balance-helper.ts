import { Inject, Injectable } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { borrowed, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { SushiswapKashiContractFactory } from '../contracts';
import { SUSHISWAP_KASHI_DEFINITION } from '../sushiswap-kashi.definition';

type SushiSwapKashiGetBalancesParams = {
  address: string;
  network: Network;
};

@Injectable()
export class SushiSwapKashiLendingBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SushiswapKashiContractFactory) private readonly contractFactory: SushiswapKashiContractFactory,
  ) {}

  async getBalances({ address, network }: SushiSwapKashiGetBalancesParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const sushiswapKashiTokens = await this.appToolkit.getAppTokenPositions({
      appId: SUSHISWAP_KASHI_DEFINITION.id,
      groupIds: [SUSHISWAP_KASHI_DEFINITION.groups.lending.id],
      network: network,
    });

    const balances = await Promise.all(
      sushiswapKashiTokens
        .filter(v => v.supply > 0)
        .map(async kashiToken => {
          const kashiTokenContract = this.contractFactory.sushiswapKashiLendingToken({
            address: kashiToken.address,
            network,
          });

          const [balanceRaw, collateralTokenAddressRaw, collateralBalanceRaw, debtBalanceRaw] = await Promise.all([
            multicall.wrap(kashiTokenContract).balanceOf(address),
            multicall.wrap(kashiTokenContract).collateral(),
            multicall.wrap(kashiTokenContract).userCollateralShare(address),
            multicall.wrap(kashiTokenContract).userBorrowPart(address),
          ]);

          const tokenBalance = drillBalance(kashiToken, balanceRaw.toString());
          const collateralTokenAddress = collateralTokenAddressRaw.toLowerCase();
          const collateralToken = baseTokens.find(p => p.address === collateralTokenAddress);
          const debtToken = baseTokens.find(p => p.address === kashiToken.tokens[0].address);
          if (!collateralToken || !debtToken) return [tokenBalance];

          const collateralTokenBalance = drillBalance(supplied(collateralToken), collateralBalanceRaw.toString());
          const debtTokenBalance = drillBalance(borrowed(debtToken), debtBalanceRaw.toString(), { isDebt: true });
          const tokens = [collateralTokenBalance, debtTokenBalance];
          const balanceUSD = collateralTokenBalance.balanceUSD + debtTokenBalance.balanceUSD;

          const leveragePosition: ContractPositionBalance = {
            type: ContractType.POSITION,
            appId: kashiToken.appId,
            groupId: kashiToken.groupId,
            address: kashiToken.address,
            network: kashiToken.network,
            tokens,
            balanceUSD,
            dataProps: kashiToken.dataProps,
            displayProps: kashiToken.displayProps,
          };

          return [tokenBalance, leveragePosition];
        }),
    );

    return compact(balances.flat());
  }
}
