import { type BigNumber, constants } from 'ethers';

import type { GetDataPropsParams, GetTokenPropsParams } from '~position/template/app-token.template.types';

import type { ExactlyMarketDefinition } from '../common/exactly.definitions-resolver';
import { type ExactlyMarketProps, ExactlyTokenFetcher } from '../common/exactly.token-fetcher';
import type { Market } from '../contracts';

export abstract class ExactlyDepositFetcher extends ExactlyTokenFetcher {
  groupLabel = 'Variable Deposit';

  getSupply({ definition }: GetTokenPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return Promise.resolve(definition.totalFloatingDepositShares);
  }

  getTotalAssets({ definition }: GetTokenPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return definition.totalFloatingDepositAssets;
  }

  async getApr({
    definition: { blockNumber, timestamp, totalFloatingDepositShares, totalFloatingDepositAssets },
    multicall: { contract: multicall },
    contract: market,
  }: GetDataPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    const [, [[, totalSupplyData], [, totalAssetsData], [, tsData]]] = await multicall.callStatic.aggregate(
      [
        { target: market.address, callData: market.interface.encodeFunctionData('totalSupply') },
        { target: market.address, callData: market.interface.encodeFunctionData('totalAssets') },
        { target: multicall.address, callData: multicall.interface.encodeFunctionData('getCurrentBlockTimestamp') },
      ],
      true,
      { blockTag: blockNumber - 123 },
    );
    const [prevTotalSupply] = market.interface.decodeFunctionResult('totalSupply', totalSupplyData) as [BigNumber];
    const [prevTotalAssets] = market.interface.decodeFunctionResult('totalAssets', totalAssetsData) as [BigNumber];
    const [prevTimestamp] = multicall.interface.decodeFunctionResult('getCurrentBlockTimestamp', tsData) as [BigNumber];

    const shareValue = totalFloatingDepositAssets.mul(constants.WeiPerEther).div(totalFloatingDepositShares);
    const prevShareValue = prevTotalAssets.mul(constants.WeiPerEther).div(prevTotalSupply);
    const proportion = shareValue.mul(constants.WeiPerEther).div(prevShareValue);
    return (Number(proportion) / 1e16 - 100) * (31_536_000 / (timestamp - prevTimestamp.toNumber()));
  }
}
