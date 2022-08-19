import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import _, { compact } from 'lodash';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { IdleContractFactory } from '../contracts';
import { IDLE_DEFINITION } from '../idle.definition';

type IdlePYTResponse = {
  trancheInfos: {
    id: string;
  }[];
};

const query = gql`
  query fetchPYT {
    trancheInfos(orderBy: totalSupply, orderDirection: desc) {
      id
    }
 }
`;

const appId = IDLE_DEFINITION.id;
const groupId = IDLE_DEFINITION.groups.pyt.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumIdlePytTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(IdleContractFactory) private readonly idleContractFactory: IdleContractFactory,
  ) {}

  @CacheOnInterval({
      key: `studio:${appId}:${groupId}:${network}:addresses`,
      timeout: 15 * 60 * 1000,
    })
  async getPYTAddresses() {
      const endpoint = `https://api.thegraph.com/subgraphs/name/samster91/idle-tranches`;
      const data = await this.appToolkit.helpers.theGraphHelper.request<IdlePYTResponse>({ endpoint, query });
      return data.trancheInfos.map(v => v);
  }

  async getPositions() {
      const multicall = this.appToolkit.getMulticall(network);
      const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
      const pytsAddresses = await this.getPYTAddresses();

      const pytsTokens = await Promise.all(
        pytsAddresses.map(async pyt => {
          const trancheAddress = pyt.id.toLowerCase();
          const tokenContract = this.IdleContractFactory.getApr({ address: trancheAddress, network });
          const [name, decimals, supplyRaw, trackedAssetAddresses] = await Promise.all([
            multicall.wrap(tokenContract).name(),
            multicall.wrap(tokenContract).symbol(),
            multicall.wrap(tokenContract).decimals(),
            multicall.wrap(tokenContract).totalSupply(),
            multicall.wrap(tokenContract).getTrackedAssets(),
          ]);

      const underlyingTokens = trackedAssetAddresses.map(token => {
            return baseTokens.find(x => x.address === token.toLowerCase());
      });

      const supply = Number(supplyRaw) / 10 ** decimals;
      if (supply === 0) return null;


      const underlyingToken = allTokenDependencies.find(
          (v) => v.address === underlyingTokenAddress
        );
        if (!underlyingToken) return null;

      const pricePerShare = 1;
      const price = pricePerShare * underlyingToken.price;
      const tokens = compact(underlyingTokens);
      const liquidity = price * supply;
      const displayProps = {
          label,
          secondaryLabel,
          images,
          statsItems: [
            { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
            { label: 'APY', value: buildPercentageDisplayItem(apy) },
          ],
        };

      const token: AppTokenPosition = {
            type: ContractType.APP_TOKEN,
            appId,
            groupId,
            address: trancheAddress,
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
      return _.compact(pytsTokens);
  }
}
