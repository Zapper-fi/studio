import { Inject } from '@nestjs/common';
import { utils } from 'ethers';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PhutureContractFactory } from '../contracts';
import { PHUTURE_DEFINITION } from '../phuture.definition';

const appId = PHUTURE_DEFINITION.id;
const groupId = PHUTURE_DEFINITION.groups.index.id;
const network = Network.ETHEREUM_MAINNET;

const addresses = {
  PDI: '0x632806bf5c8f062932dd121244c9fbe7becb8b48',
  vTokenFactory: '0x24ad48f31cab5e35d0e9cdfa9213b5451f22fb92',
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumPhutureIndexTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PhutureContractFactory) private readonly phutureContractFactory: PhutureContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const indexContract = this.phutureContractFactory.managedIndex({ network, address: addresses.PDI });
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

        const underlyingToken = baseTokens.find(v => v.address === underlyingAddress);
        if (!underlyingToken) return null;

        const vTokenAddress = await multicall.wrap(vTokenFactoryContract).vTokenOf(underlyingAddress);
        const vTokenContract = this.phutureContractFactory.vToken({ network, address: vTokenAddress });
        const balanceOfRaw = await multicall.wrap(vTokenContract).assetBalanceOf(indexContract.address);
        const balanceOf = utils.formatUnits(balanceOfRaw, underlyingToken.decimals);

        return {
          liquidity: Number(balanceOf) * underlyingToken.price,
          baseToken: underlyingToken,
        };
      }),
    );

    const tokensWithLiquidity = _.compact(tokensWithLiquidityRaw);

    const tokens = tokensWithLiquidity.map(x => x.baseToken);
    const liquidityPerToken = tokensWithLiquidity.map(x => x.liquidity);

    const liquidity = _.sum(liquidityPerToken);
    const supply = utils.formatEther(supplyRaw);
    const pricePerShare = 1;
    const price = liquidity / Number(supply);

    const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];

    const indexPosition: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address: indexContract.address,
      network,
      supply: Number(supply),
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
