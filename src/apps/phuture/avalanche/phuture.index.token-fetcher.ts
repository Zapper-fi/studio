import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { AAVE_V2_DEFINITION } from '~apps/aave-v2';
import { COMPOUND_DEFINITION } from '~apps/compound';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PhutureContractFactory } from '../contracts';
import { PHUTURE_DEFINITION } from '../phuture.definition';

const appId = PHUTURE_DEFINITION.id;
const groupId = PHUTURE_DEFINITION.groups.index.id;
const network = Network.AVALANCHE_MAINNET;

const addresses = {
  CAI: '0x48f88a3fe843ccb0b5003e70b4192c1d7448bef0',
  vTokenFactory: '0xa654211ae2fac7e029df45fcdc0acfa77e174134',
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalanchePhutureIndexTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PhutureContractFactory) private readonly phutureContractFactory: PhutureContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(
      {
        appId: AAVE_V2_DEFINITION.id,
        groupIds: [AAVE_V2_DEFINITION.groups.supply.id],
        network,
      },
      {
        appId: COMPOUND_DEFINITION.id,
        groupIds: [COMPOUND_DEFINITION.groups.supply.id],
        network,
      },
    );

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const allTokens = [...baseTokens, ...appTokens];

    const indexContract = this.phutureContractFactory.managedIndex({ network, address: addresses.CAI });
    const vTokenFactoryContract = this.phutureContractFactory.vTokenFactory({
      network,
      address: addresses.vTokenFactory,
    });

    const [label, symbol, decimals, supplyRaw, anatomy] = await Promise.all([
      multicall.wrap(indexContract).name(),
      multicall.wrap(indexContract).symbol(),
      multicall.wrap(indexContract).decimals(),
      multicall.wrap(indexContract).totalSupply(),
      multicall.wrap(indexContract).anatomy(),
    ]);

    const tokensWithLiquidityRaw = await Promise.all(
      anatomy._assets.map(async underlyingAddressRaw => {
        const underlyingAddress = underlyingAddressRaw.toLowerCase();

        const underlyingToken = allTokens.find(v => v.address === underlyingAddress);
        if (!underlyingToken) return null;

        const vTokenAddress = await multicall.wrap(vTokenFactoryContract).vTokenOf(underlyingAddress);
        const vTokenContract = this.phutureContractFactory.vToken({ network, address: vTokenAddress });
        const balanceOfRaw = await multicall.wrap(vTokenContract).assetBalanceOf(underlyingAddress);
        const balanceOf = Number(balanceOfRaw) / 10 ** underlyingToken.decimals;

        return {
          liquidity: balanceOf * underlyingToken.price,
          baseToken: underlyingToken,
        };
      }),
    );

    const tokensWithLiquidity = _.compact(tokensWithLiquidityRaw);
    const tokens = tokensWithLiquidity.map(x => x.baseToken);
    const liquidityPerToken = tokensWithLiquidity.map(x => x.liquidity);

    const price = _.sum(liquidityPerToken);
    const supply = Number(supplyRaw) / 10 ** decimals;
    const pricePerShare = 1;
    const liquidity = price * supply;

    const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];

    const indexPosition: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address: indexContract.address,
      network,
      supply,
      decimals,
      symbol,
      price,
      pricePerShare,
      tokens,

      dataProps: {
        liquidity,
        exchangeable: true,
      },

      displayProps: {
        label,
        secondaryLabel: symbol,
        images: [getTokenImg(indexContract.address, network)],
        statsItems,
      },
    };

    return [indexPosition];
  }
}
