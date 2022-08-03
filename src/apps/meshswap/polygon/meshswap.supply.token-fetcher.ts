import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MeshswapContractFactory } from '../contracts';
import { MESHSWAP_DEFINITION } from '../meshswap.definition';

const appId = MESHSWAP_DEFINITION.id;
const groupId = MESHSWAP_DEFINITION.groups.supply.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonMeshswapSupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MeshswapContractFactory) private readonly meshswapContractFactory: MeshswapContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const singlePoolFactoryContract = this.meshswapContractFactory.meshswapSinglePoolFactory({
      network,
      address: '0x504722a6eabb3d1573bada9abd585ae177d52e7a',
    });

    const poolCountRaw = await multicall.wrap(singlePoolFactoryContract).getPoolCount();
    const poolCount = Number(poolCountRaw);

    const positions = await Promise.all(
      _.range(0, poolCount).map(async index => {
        const addressRaw = await multicall.wrap(singlePoolFactoryContract).getPoolAddressByIndex(index);
        const address = addressRaw.toLowerCase();
        const singlePoolContract = this.meshswapContractFactory.meshswapSinglePool({
          network,
          address,
        });

        const [
          totalSupplyRaw,
          decimals,
          underlyingTokenAddressRaw,
          symbol,
          label,
          cashRaw,
          borrowAmountRaw,
          exchangeRateRaw,
        ] = await Promise.all([
          multicall.wrap(singlePoolContract).totalSupply(),
          multicall.wrap(singlePoolContract).decimals(),
          multicall.wrap(singlePoolContract).token(),
          multicall.wrap(singlePoolContract).symbol(),
          multicall.wrap(singlePoolContract).name(),
          multicall.wrap(singlePoolContract).getCash(),
          multicall.wrap(singlePoolContract).totalBorrows(),
          multicall.wrap(singlePoolContract).exchangeRateStored(),
        ]);

        const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();

        const tokens = baseTokens.find(x => x.address == underlyingTokenAddress);
        if (!tokens) return null;

        const exchangeRate = Number(exchangeRateRaw) / 10 ** 18;
        const cash = Number(cashRaw) / 10 ** decimals;
        const borrowAmount = Number(borrowAmountRaw) / 10 ** decimals;

        const liquidity = borrowAmount + cash;
        const supply = Number(totalSupplyRaw) / 10 ** decimals;
        const pricePerShare = 1;
        const price = tokens.price;

        const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];

        const poolToken: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address,
          network,
          supply,
          decimals,
          symbol,
          price,
          pricePerShare,
          tokens: [tokens],

          dataProps: {
            liquidity,
            exchangeRate,
          },

          displayProps: {
            label,
            secondaryLabel: symbol,
            images: [getTokenImg(tokens.address, network)],
            statsItems,
          },
        };

        return poolToken;
      }),
    );

    return _.compact(positions);
  }
}
