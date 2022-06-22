import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network, NETWORK_IDS } from '~types/network.interface';

import { ACROSS_V2_DEFINITION } from '../across-v2.definition';
import { ACROSS_V2_POOL_DEFINITIONS, POOL_TOKENS } from '../across.pool.definitions';
import { AcrossV2ContractFactory } from '../contracts';

const appId = ACROSS_V2_DEFINITION.id;
const groupId = ACROSS_V2_DEFINITION.groups.pool.id;
const network = Network.ARBITRUM_MAINNET;
const networkId = NETWORK_IDS[network]

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class ArbitrumAcrossV2PoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(AcrossV2ContractFactory) private readonly acrossV2ContractFactory: AcrossV2ContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const poolAddress = await ACROSS_V2_POOL_DEFINITIONS.find(pool => pool.chainId === networkId)
    let address = ''
    if(poolAddress) {
      address = poolAddress.poolAddress;
    }
    const tokens = await Promise.all(
      POOL_TOKENS.map(async pool => {
        const underlyingToken = baseTokens.find(v => v.symbol === token.symbol);
        
        if (!underlyingToken) return null;
        const tokenContract = this.appToolkit.globalContracts.erc20({ network, address: underlyingToken.address })
        const [label, symbol, decimals, supplyRaw, balance] = await Promise.all([
          multicall.wrap(tokenContract).name(),
          multicall.wrap(tokenContract).symbol(),
          multicall.wrap(tokenContract).decimals(),
          multicall.wrap(tokenContract).totalSupply(),
          multicall.wrap(tokenContract).balanceOf(address),
        ]);

        if (!underlyingToken) return null;

        const supply = Number(supplyRaw) / 10 ** decimals;
        const pricePerShare = Number(balance) / 10 ** underlyingToken.decimals;
        const price = underlyingToken.price;
        const tokens = [underlyingToken];
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = [getAppImg(ACROSS_V2_DEFINITION.id)];
        const liquidity = price * supply;
        const dataProps = { liquidity };
        const displayProps = {
          label,
          secondaryLabel,
          images,
          statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }],
        };

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          address: pool.tokenAddress,
          appId,
          groupId,
          network,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,
          dataProps,
          displayProps,
        };

        return token;
      }),
    );

    return compact(tokens);
  }
}
