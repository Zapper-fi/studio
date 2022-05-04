import { Inject, Injectable } from '@nestjs/common';
import { compact } from 'lodash';

import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherContractFactory } from '../contracts';
import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

const appId = POOL_TOGETHER_DEFINITION.id;
const groupId = POOL_TOGETHER_DEFINITION.groups.v4.id;

type GetTokenMarketDataParams = {
  network: Network;
  prizePoolAddresses: string[];
};

@Injectable()
export class PoolTogetherV4PrizePoolTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherContractFactory) private readonly contractFactory: PoolTogetherContractFactory,
  ) {}

  async getAppTokens({ network, prizePoolAddresses }: GetTokenMarketDataParams) {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const vaultTokens = await Promise.all(
      prizePoolAddresses.map(async poolAddress => {
        const poolContract = this.contractFactory.poolTogetherV4PrizePool({ network, address: poolAddress });

        // Retrieve ticket token and deposit token
        const [ticketTokenAddressRaw, underlyingTokenAddressRaw] = await Promise.all([
          multicall.wrap(poolContract).getTicket(),
          multicall.wrap(poolContract).getToken(),
        ]);

        const ticketAddress = ticketTokenAddressRaw.toLowerCase();
        const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();

        // Calculate the supply by the amount of available tickets
        const ticketTokenContract = this.contractFactory.erc20({ network, address: ticketAddress });
        const [symbol, supplyRaw, decimalsRaw] = await Promise.all([
          multicall.wrap(ticketTokenContract).symbol(),
          multicall.wrap(ticketTokenContract).totalSupply(),
          multicall.wrap(ticketTokenContract).decimals(),
        ]);

        const decimals = Number(decimalsRaw);
        const supply = Number(supplyRaw) / 10 ** decimals;

        const underlyingToken = baseTokens.find(t => t?.address === underlyingTokenAddress);
        if (!underlyingToken) {
          return null;
        }

        const pricePerShare = 1; // Minted 1:1
        const price = underlyingToken.price * pricePerShare;
        const liquidity = supply * underlyingToken.price;
        const isBlocked = true; // Zaps unsupported yet for V4

        const vaultToken: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          network,
          address: ticketAddress,
          decimals: underlyingToken.decimals,
          symbol,
          dataProps: {
            liquidity,
            isBlocked,
          },
          displayProps: {
            label: symbol,
            secondaryLabel: buildDollarDisplayItem(price),
            images: [getTokenImg(underlyingToken.address, network)],
          },
          supply,
          price,
          pricePerShare,
          tokens: [underlyingToken],
        };

        return vaultToken;
      }),
    );

    return compact(vaultTokens);
  }
}
