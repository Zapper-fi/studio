import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherContractFactory } from '../contracts';
import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

export type PoolTogetherPodTokenDataProps = {
  liquidity: number;
};

type GetPodTokensParams = {
  network: Network;
  registryAddress: string;
};

export class PoolTogetherV3PodTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherContractFactory) private readonly contractFactory: PoolTogetherContractFactory,
  ) {}

  async getTokens({ network, registryAddress }: GetPodTokensParams) {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const registryContract = this.contractFactory.poolTogetherV3PodRegistry({ address: registryAddress, network });
    const podAddresses = await registryContract.getAddresses();

    const vaultTokens = await Promise.all(
      podAddresses.map(async podAddressRaw => {
        const podAddress = podAddressRaw.toLowerCase();
        const podContract = this.contractFactory.poolTogetherV3Pod({ address: podAddress, network });

        const [pricePerShareRaw, underlyingTokenAddressRaw, decimals, symbol, label, totalSupplyRaw] =
          await Promise.all([
            multicall.wrap(podContract).getPricePerShare(),
            multicall.wrap(podContract).token(),
            multicall.wrap(podContract).decimals(),
            multicall.wrap(podContract).symbol(),
            multicall.wrap(podContract).name(),
            multicall.wrap(podContract).totalSupply(),
          ]);

        const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();
        const underlyingToken = baseTokens.find(p => p.address === underlyingTokenAddress);

        // Bail early if no underlying token is found
        if (!underlyingToken) {
          return null;
        }

        const supply = Number(totalSupplyRaw) / 10 ** decimals;
        const pricePerShare = Number(pricePerShareRaw) / 10 ** decimals;
        const price = underlyingToken.price * pricePerShare;
        const liquidity = price * supply;
        const tokens = [underlyingToken];

        // Display Props
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = [getTokenImg(underlyingToken.address, network)];

        const token: AppTokenPosition<PoolTogetherPodTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          address: podAddress,
          appId: POOL_TOGETHER_DEFINITION.id,
          groupId: POOL_TOGETHER_DEFINITION.groups.v3.id,
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
          },
        };

        return token;
      }),
    );

    return compact(vaultTokens);
  }
}
