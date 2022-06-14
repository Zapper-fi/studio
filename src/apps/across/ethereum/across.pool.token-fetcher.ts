import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import ACROSS_DEFINITION from '../across.definition';
import { AcrossContractFactory } from '../contracts';

import { ACROSS_V1_POOL_DEFINITIONS } from './across.pool.definitions';

const appId = ACROSS_DEFINITION.id;
const groupId = ACROSS_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumAcrossPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(AcrossContractFactory) private readonly acrossContractFactory: AcrossContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const tokens = await Promise.all(
      ACROSS_V1_POOL_DEFINITIONS.map(async pool => {
        const tokenContract = this.acrossContractFactory.badgerPool({ address: pool.poolAddress, network });
        const [label, symbol, decimals, supplyRaw, l1TokenAddressRaw, pricePerShareRaw] = await Promise.all([
          multicall.wrap(tokenContract).name(),
          multicall.wrap(tokenContract).symbol(),
          multicall.wrap(tokenContract).decimals(),
          multicall.wrap(tokenContract).totalSupply(),
          multicall.wrap(tokenContract).l1Token(),
          multicall.wrap(tokenContract).callStatic.exchangeRateCurrent(),
        ]);

        const l1TokenAddress = l1TokenAddressRaw.toLowerCase();
        const underlyingToken = baseTokens.find(v => v.address === l1TokenAddress);
        if (!underlyingToken) return null;

        const supply = Number(supplyRaw) / 10 ** decimals;
        const pricePerShare = Number(pricePerShareRaw) / 10 ** underlyingToken.decimals;
        const price = underlyingToken.price * pricePerShare;
        const tokens = [underlyingToken];
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = [getAppImg(ACROSS_DEFINITION.id)];
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
          address: pool.poolAddress,
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
