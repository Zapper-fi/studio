import { Inject, Injectable } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { CurvePoolTokenHelper } from '~apps/curve';
import { Erc20 } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { TempusContractFactory, TempusAmm } from '../contracts';
import { TEMPUS_DEFINITION } from '../tempus.definition';

import { getTempusData } from './tempus.datasource';

const appId = TEMPUS_DEFINITION.id;
const groupId = TEMPUS_DEFINITION.groups.amm.id;

@Injectable()
export class TempusAmmTokenFetcher {
  constructor(
    @Inject(CurvePoolTokenHelper)
    private readonly curvePoolTokenHelper: CurvePoolTokenHelper,
    @Inject(TempusContractFactory) private readonly contractFactory: TempusContractFactory,
  ) {}

  async getPositions(network: Network) {
    const data = await getTempusData(network);
    if (!data) return [];

    return await this.curvePoolTokenHelper.getTokens<TempusAmm, Erc20>({
      network,
      appId,
      groupId,
      appTokenDependencies: [{ appId, groupIds: [TEMPUS_DEFINITION.groups.pool.id], network }],
      resolvePoolDefinitions: async () =>
        data.tempusPools.map(pool => ({
          swapAddress: pool.ammAddress.toLowerCase(),
          tokenAddress: pool.ammAddress.toLowerCase(),
        })),
      resolvePoolContract: ({ network, definition }) =>
        this.contractFactory.tempusAmm({ network, address: definition.swapAddress }),
      resolvePoolTokenContract: ({ network, definition }) =>
        this.contractFactory.erc20({ network, address: definition.tokenAddress }),
      resolvePoolCoinAddresses: async ({ poolContract }) => {
        const pool = data.tempusPools.find(
          pool => pool.ammAddress.toLowerCase() === poolContract.address.toLowerCase(),
        )!;
        return [pool.principalsAddress.toLowerCase(), pool.yieldsAddress.toLowerCase()];
      },
      resolvePoolReserves: async ({ multicall, poolContract }) => {
        const totalSupply = await multicall.wrap(poolContract).totalSupply();
        const [principals, yields] = await multicall.wrap(poolContract).getExpectedTokensOutGivenBPTIn(totalSupply);
        return [principals.toString(), yields.toString()];
      },
      resolvePoolFee: ({ multicall, poolContract }) =>
        multicall
          .wrap(poolContract)
          .getSwapFeePercentage()
          .then(result => BigNumber.from(Number(result) / 1e8)), // Convert 1e18 percentage to curve 1e8
      resolvePoolTokenSymbol: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).totalSupply(),
      resolvePoolTokenPrice: async ({ tokens, reserves, supply }) => {
        const [principalToken, yieldToken] = tokens;
        const [sizePrincipal, sizeYield] = reserves;
        const price = ((principalToken.price * sizePrincipal) + (yieldToken.price * sizeYield)) / supply;
        return price;
      },
    });
  }
}
