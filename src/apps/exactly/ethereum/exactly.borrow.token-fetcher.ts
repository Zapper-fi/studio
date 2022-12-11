import { constants } from 'ethers';

import { Register } from '~app-toolkit/decorators';
import type { IMulticallWrapper } from '~multicall/multicall.interface';
import type { AppTokenPosition } from '~position/position.interface';
import type { GetDataPropsParams, GetTokenPropsParams } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import type { ExactlyMarketDefinition } from '../common/exactly.definitions-resolver';
import { ExactlyTokenFetcher } from '../common/exactly.token-fetcher';
import type { ExactlyMarketProps } from '../common/exactly.token-fetcher';
import type { Market } from '../contracts';
import { EXACTLY_DEFINITION } from '../exactly.definition';

const group = EXACTLY_DEFINITION.groups.borrow;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId: EXACTLY_DEFINITION.id, groupId: group.id, network })
export class EthereumExactlyBorrowTokenFetcher extends ExactlyTokenFetcher {
  groupLabel = group.label;
  groupId = group.id;
  network = network;
  isDebt = true;

  getSupply({ definition }: GetTokenPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return Promise.resolve(definition.totalFloatingBorrowShares);
  }

  getTotalAssets({ definition }: GetTokenPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return definition.totalFloatingBorrowAssets;
  }

  async getBalancePerToken({
    address,
    appToken,
    multicall,
  }: {
    address: string;
    appToken: AppTokenPosition;
    multicall: IMulticallWrapper;
  }) {
    const { floatingBorrowShares } = await this.definitionsResolver.getDefinition({
      multicall,
      network: this.network,
      account: address,
      market: appToken.address,
    });
    return floatingBorrowShares;
  }

  async getApr({
    contract,
    multicall,
    definition: { interestRateModel },
  }: GetDataPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    const [debt, assets, utilization] = await Promise.all([
      contract.floatingDebt(),
      contract.floatingAssets(),
      contract.floatingUtilization(),
    ]);
    const rate = await multicall
      .wrap(this.contractFactory.interestRateModel({ address: interestRateModel.id, network: this.network }))
      .floatingBorrowRate(utilization, assets.isZero() ? 0 : debt.mul(constants.WeiPerEther).div(assets));
    return Number(rate) / 1e18;
  }
}
