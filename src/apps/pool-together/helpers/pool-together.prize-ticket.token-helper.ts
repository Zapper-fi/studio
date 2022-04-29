import { Inject } from '@nestjs/common';
import { compact, sum } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { PoolTogetherContractFactory } from '../contracts';
import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

import { PoolTogetherFaucetAddressHelper } from './pool-together.faucet.address-helper';

export type PoolTogetherPrizeTicketTokenDataProps = {
  apy: number;
  liquidity: number;
  faucetAddresses: string[];
};

type GetPrizeTicketTokensParams = {
  network: Network;
  dependencies: AppGroupsDefinition[];
  prizePoolAddresses: string[];
};

export class PoolTogetherPrizeTicketTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherContractFactory) private readonly poolTogetherContractFactory: PoolTogetherContractFactory,
    @Inject(PoolTogetherFaucetAddressHelper)
    private readonly faucetAddressFetchStrategy: PoolTogetherFaucetAddressHelper,
  ) {}

  async getTokens({ network, dependencies, prizePoolAddresses }: GetPrizeTicketTokensParams) {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);
    const allTokens = [...appTokens, ...baseTokens];

    const vaultTokens = await Promise.all(
      prizePoolAddresses.map(async poolAddress => {
        const poolContract = this.poolTogetherContractFactory.poolTogetherPrizePool({ address: poolAddress, network });
        const faucetAddresses = await this.faucetAddressFetchStrategy.getAddresses({ network, poolAddress });

        const [ticketTokenAddressesRaw, underlyingTokenAddressRaw] = await Promise.all([
          multicall.wrap(poolContract).tokens(),
          multicall.wrap(poolContract).token(),
        ]);

        // Find the pool ticket address
        const maybeTicketContract = this.poolTogetherContractFactory.poolTogetherPrizeTicket({
          address: ticketTokenAddressesRaw[1],
          network,
        });

        const ticketAddressRaw = await multicall
          .wrap(maybeTicketContract)
          .chanceOf(ZERO_ADDRESS)
          .then(() => ticketTokenAddressesRaw[1])
          .catch(() => ticketTokenAddressesRaw[0]);

        const ticketAddress = ticketAddressRaw.toLowerCase();
        const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();

        // Calculate the supply by the amount of available tickets
        const ticketTokenContract = this.appToolkit.globalContracts.erc20({ address: ticketAddress, network });
        const [symbol, supplyRaw, decimals] = await Promise.all([
          multicall.wrap(ticketTokenContract).symbol(),
          multicall.wrap(ticketTokenContract).totalSupply(),
          multicall.wrap(ticketTokenContract).decimals(),
        ]);

        const supply = Number(supplyRaw) / 10 ** decimals;
        const underlyingToken = allTokens.find(p => p?.address === underlyingTokenAddress);
        if (!underlyingToken) return null;

        const pricePerShare = 1; // Minted 1:1
        const price = underlyingToken.price * pricePerShare;
        const liquidity = supply * underlyingToken.price;
        const tokens = [underlyingToken];

        // Display Props
        const label = symbol;
        const secondaryLabel = buildDollarDisplayItem(price);
        const images =
          underlyingToken.type === ContractType.BASE_TOKEN
            ? [getTokenImg(underlyingToken.address, network)]
            : underlyingToken.displayProps.images;

        const apys = await Promise.all(
          faucetAddresses.map(async address => {
            if (!address) {
              return 0;
            }
            const faucetContract = this.poolTogetherContractFactory.poolTogetherPoolFaucet({ address, network });
            const [dripRatePerSecond, rewardTokenAddressRaw] = await Promise.all([
              multicall.wrap(faucetContract).dripRatePerSecond(),
              multicall.wrap(faucetContract).asset(),
            ]);

            if (rewardTokenAddressRaw === ZERO_ADDRESS) return 0;
            const rewardTokenAddress = rewardTokenAddressRaw.toLowerCase();
            const totalDripPerDay = (Number(dripRatePerSecond) / 10 ** 18) * 86400;
            const rewardPriceObj = baseTokens.find(p => p?.address === rewardTokenAddress);
            const rewardMarketObj = appTokens.find(p => p?.address === rewardTokenAddress);
            const rewardTokenPrice = rewardMarketObj?.price ?? rewardPriceObj?.price ?? 0;

            const totalDripDailyValue = totalDripPerDay * rewardTokenPrice;
            return (totalDripDailyValue / liquidity) * 365;
          }),
        );

        const apy = sum(apys);

        const token: AppTokenPosition<PoolTogetherPrizeTicketTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          address: ticketAddress,
          appId: POOL_TOGETHER_DEFINITION.id,
          groupId: POOL_TOGETHER_DEFINITION.groups.prizeTicket.id,
          network,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            apy,
            liquidity,
            faucetAddresses: compact(faucetAddresses),
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
