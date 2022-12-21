import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { KeeperContractFactory } from '../contracts';
import { KEEPER_DEFINITION } from '../keeper.definition';

const appId = KEEPER_DEFINITION.id;
const groupId = KEEPER_DEFINITION.groups.klp.id;
const network = Network.ETHEREUM_MAINNET;
const KLP_ADDRESSES = ['0x3f6740b5898c5d3650ec6eace9a649ac791e44d7'];

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumKeeperKlpTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(KeeperContractFactory) private readonly keeperContractFactory: KeeperContractFactory,
  ) { }

  async getPositions() {
    // A user can deposit base tokens like LOOKS or LQTY
    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(
      network
    );
    const allTokenDependencies = [
      ...baseTokenDependencies,
    ];

    // Create a multicall wrapper instance to batch chain RPC calls together
    const multicall = this.appToolkit.getMulticall(network);

    const tokens = await Promise.all(
      KLP_ADDRESSES.map(async (klpAddress) => {
        const contract = this.keeperContractFactory.klp({
          address: klpAddress,
          network,
        });

        const [symbol, decimals, supplyRaw, underlyingToken0RawAddress, underlyingToken1RawAddress] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
          multicall.wrap(contract).token0(),
          multicall.wrap(contract).token1(),
        ]);

        // Denormalize the supply
        const supply = Number(supplyRaw) / 10 ** decimals;

        // Find the underlying token in our dependencies
        const underlyingToken0Address = underlyingToken0RawAddress.toLowerCase();
        const underlyingToken0 = allTokenDependencies.find(
          (v) => v.address === underlyingToken0Address
        );
        const underlyingToken1Address = underlyingToken1RawAddress.toLowerCase();
        const underlyingToken1 = allTokenDependencies.find(
          (v) => v.address === underlyingToken1Address
        );

        if (!underlyingToken0 || !underlyingToken1) {
          console.log('did not find token0 or token1', underlyingToken0, underlyingToken1)
          return null;
        }

        // if (!underlyingToken) return null;
        const tokens = [underlyingToken0, underlyingToken1];

        // Denormalize the price per share
        // const pricePerShare = Number(1) / 10 ** 18;
        // const price = pricePerShare * 10 ** 18;
        const pricePerShare = 1;
        const price = 2 * Math.sqrt(underlyingToken0.price / underlyingToken1.price) * underlyingToken1.price;

        const label = 'KLP Token';
        const images = [...getImagesFromToken(underlyingToken0), ...getImagesFromToken(underlyingToken1)];
        const secondaryLabel = buildDollarDisplayItem(price);

        // Create the token object
        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: klpAddress,
          network,
          symbol,
          decimals,
          supply,
          tokens,
          price,
          pricePerShare,
          dataProps: {},
          displayProps: {
            label,
            images,
            secondaryLabel,
          },
        };

        return token;
      })
    );

    return tokens.filter(token => !!token) as AppTokenPosition[];
  }
}
