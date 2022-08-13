import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { Addresses } from '../addresses';
import { DfxContractFactory } from '../contracts';
import { DFX_DEFINITION } from '../dfx.definition';

const appId = DFX_DEFINITION.id;
const groupId = DFX_DEFINITION.groups.curve.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonDfxCurveTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(DfxContractFactory) private readonly dfxContractFactory: DfxContractFactory,
  ) {}

  async getPositions() {
    const curveAddresses = Addresses[network].amm.map(v => v.curve);

    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);

    // Create multipcall wrapper for batch RPC calls
    const multicall = this.appToolkit.getMulticall(network);

    const lpTokens = await Promise.all(
      curveAddresses.map(async curveAddress => {
        // Fetch data from DFX curve contract
        const contract = this.dfxContractFactory.dfxCurve({ address: curveAddress, network });
        const [
          name,
          symbol,
          decimals,
          supplyRaw,
          token0AddressRaw,
          token1AddressRaw,
          [totalLiquidityRaw, underlyingLiquidityRaw],
        ] = await Promise.all([
          multicall.wrap(contract).name(),
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
          multicall.wrap(contract).numeraires(0),
          multicall.wrap(contract).numeraires(1),
          multicall.wrap(contract).liquidity(),
        ]);
        const underlyingTokenAddresses = [token0AddressRaw.toLowerCase(), token1AddressRaw.toLowerCase()];

        // Find underlying tokens from base dependencies
        const [token0, token1] = underlyingTokenAddresses.map(tokenAddress =>
          baseTokenDependencies.find(v => v.address === tokenAddress.toLowerCase()),
        );

        // Remove any pools containing tokens that aren't available
        if (!token0 || !token1) return null;
        const tokens = [token0, token1];

        // Denormalize big integer values
        const supply = Number(supplyRaw) / 10 ** decimals;
        const liquidity = Number(totalLiquidityRaw) / 1e18;
        const reserves = underlyingLiquidityRaw.map(reserveRaw => Number(reserveRaw) / 10 ** 18); // DFX report all token liquidity in 10**18
        const pricePerShare = reserves.map(r => r / supply);
        const price = liquidity / supply;

        // Prepare display props
        const [, baseToken, quoteToken] = name.split('-');
        const label = `${baseToken.toUpperCase()}/${quoteToken.toUpperCase()}`;
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = tokens.map(v => getImagesFromToken(v)).flat();

        // Create token object
        const lpToken: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: curveAddress,
          network,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,
          dataProps: {
            liquidity,
          },
          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems: [
              {
                label: 'Liquidity',
                value: buildDollarDisplayItem(liquidity),
              },
            ],
          },
        };
        return lpToken;
      }),
    );

    return _.compact(lpTokens);
  }
}
