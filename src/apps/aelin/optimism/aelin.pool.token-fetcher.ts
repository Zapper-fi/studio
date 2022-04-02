import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';
import { gql } from 'graphql-request';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AELIN_DEFINITION } from '../aelin.definition';
import { AelinContractFactory } from '../contracts';

const appId = AELIN_DEFINITION.id;
const groupId = AELIN_DEFINITION.groups.pool.id;
const network = Network.OPTIMISM_MAINNET;

type AelinPoolsResponse = {
  poolCreateds: {
    id: string;
  }[];
};

const query = gql`
  query fetchAelinPools {
    poolCreateds(first: 1000) {
      id
    }
  }
`;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismAelinPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(AelinContractFactory) private readonly aelinContractFactory: AelinContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  @CacheOnInterval({
    key: `studio:${AELIN_DEFINITION.id}:${AELIN_DEFINITION.groups.pool}:${Network.OPTIMISM_MAINNET}:addresses`,
    timeout: 15 * 60 * 1000,
  })
  async getCachedPoolAddresses() {
    const endpoint = `https://api.thegraph.com/subgraphs/name/aelin-xyz/aelin-optimism`;
    const data = await this.appToolkit.helpers.theGraphHelper.request<AelinPoolsResponse>({ endpoint, query });
    return data.poolCreateds.map(v => v.id);
  }

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const poolAddresses = await this.getCachedPoolAddresses();

    const tokens = await Promise.all(
      poolAddresses.map(async poolAddress => {
        const tokenContract = this.aelinContractFactory.aelinPool({ address: poolAddress, network });
        const [name, symbol, decimals, supplyRaw, purchaseTokenAddressRaw, isInit] = await Promise.all([
          multicall.wrap(tokenContract).name(),
          multicall.wrap(tokenContract).symbol(),
          multicall.wrap(tokenContract).decimals(),
          multicall.wrap(tokenContract).totalSupply(),
          multicall.wrap(tokenContract).purchaseToken(),
          multicall.wrap(tokenContract).calledInitialize(),
        ]);

        const purchaseTokenAddress = purchaseTokenAddressRaw.toLowerCase();
        const underlyingToken = baseTokens.find(v => v.address === purchaseTokenAddress);
        if (!isInit || !underlyingToken) return null;

        const supply = Number(supplyRaw) / 10 ** decimals;
        const pricePerShare = 1; // 1:1 with sUSD token
        const price = underlyingToken.price;
        const tokens = [underlyingToken];
        const maybeName = name.replace(/^(aePool-|aeP-)/, '');
        const labelPrefix = ethers.utils.isHexString(maybeName)
          ? ethers.utils.parseBytes32String(maybeName)
          : maybeName;

        const label = `${labelPrefix} Aelin Pool`;
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = [getAppImg(AELIN_DEFINITION.id)];
        const dataProps = {};
        const displayProps = { label, secondaryLabel, images };

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          address: poolAddress,
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
