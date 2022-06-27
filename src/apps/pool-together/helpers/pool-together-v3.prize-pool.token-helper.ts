import { Inject } from '@nestjs/common';
import { compact, sum } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { PoolTogetherContractFactory } from '../contracts';
import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

import { V3PrizePool } from './pool-together.api.prize-pool-registry';

export type PoolTogetherV3TicketTokenDataProps = {
  apy: number;
  liquidity: number;
  faucetAddresses: string[];
};

type GetTicketTokensParams = {
  network: Network;
  dependencies?: AppGroupsDefinition[];
  prizePools: V3PrizePool[];
};

export class PoolTogetherV3PrizePoolTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherContractFactory) private readonly contractFactory: PoolTogetherContractFactory,
  ) {}

  async getTokens({ network, dependencies = [], prizePools }: GetTicketTokensParams) {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);
    const allTokens = [...appTokens, ...baseTokens];

    const vaultTokens = await Promise.all(
      prizePools.map(async prizePool => {
        const { tokenFaucets, ticketAddress, sponsorshipAddress, underlyingTokenAddress } = prizePool;

        // Calculate the total supply by the amount of available tickets & sponsorship tickets
        const ticketTokenContract = this.appToolkit.globalContracts.erc20({ address: ticketAddress, network });
        const sponsorshipTokenContract = this.appToolkit.globalContracts.erc20({
          address: sponsorshipAddress,
          network,
        });
        const [ticketSymbol, ticketSupplyRaw, ticketDecimals, sponsorshipSymbol, sponsorshipSupplyRaw] =
          await Promise.all([
            multicall.wrap(ticketTokenContract).symbol(),
            multicall.wrap(ticketTokenContract).totalSupply(),
            multicall.wrap(ticketTokenContract).decimals(),
            multicall.wrap(sponsorshipTokenContract).symbol(),
            multicall.wrap(sponsorshipTokenContract).totalSupply(),
          ]);

        const ticketSupply = Number(ticketSupplyRaw) / 10 ** ticketDecimals;
        const sponsorshipSupply = Number(sponsorshipSupplyRaw) / 10 ** ticketDecimals;
        const totalSupply = ticketSupply + sponsorshipSupply;
        const underlyingToken = allTokens.find(p => p?.address === underlyingTokenAddress);
        if (!underlyingToken) return null;

        const pricePerShare = 1; // Minted 1:1
        const price = underlyingToken.price * pricePerShare;
        const liquidity = totalSupply * underlyingToken.price;
        const liquidityTicket = ticketSupply * underlyingToken.price;
        const liquiditySponsorship = sponsorshipSupply * underlyingToken.price;
        const tokens = [underlyingToken];

        // Display Props
        const secondaryLabel = buildDollarDisplayItem(price);
        const images =
          underlyingToken.type === ContractType.BASE_TOKEN
            ? [getTokenImg(underlyingToken.address, network)]
            : underlyingToken.displayProps.images;

        const apys = await Promise.all(
          tokenFaucets.map(async tokenFaucet => {
            const { tokenFaucetAddress, assetAddress } = tokenFaucet;
            if (!tokenFaucetAddress || !assetAddress) {
              return 0;
            }

            const tokenFaucetContract = this.contractFactory.poolTogetherV3TokenFaucet({
              address: tokenFaucetAddress,
              network,
            });
            const assetContract = this.contractFactory.erc20({
              address: assetAddress,
              network,
            });

            const [_dripRatePerSecond, totalUnclaimed, faucetBalance, decimals] = await Promise.all([
              multicall.wrap(tokenFaucetContract).dripRatePerSecond(),
              multicall.wrap(tokenFaucetContract).totalUnclaimed(),
              multicall.wrap(assetContract).balanceOf(tokenFaucetAddress),
              multicall.wrap(assetContract).decimals(),
            ]);
            const dripRatePerSecond = Number(_dripRatePerSecond) / 10 ** decimals;
            const remainingAssetTokens =
              Number(faucetBalance) / 10 ** decimals - Number(totalUnclaimed) / 10 ** decimals;
            const remainingSeconds = remainingAssetTokens / dripRatePerSecond;

            if (remainingSeconds <= 0) return 0;

            const totalDripPerDay = dripRatePerSecond * 86400;
            const rewardPriceObj = baseTokens.find(p => p?.address === assetAddress);
            const rewardMarketObj = appTokens.find(p => p?.address === assetAddress);
            const rewardTokenPrice = rewardMarketObj?.price ?? rewardPriceObj?.price ?? 0;

            const totalDripDailyValue = totalDripPerDay * rewardTokenPrice;
            return (totalDripDailyValue / liquidity) * 365;
          }),
        );

        const apy = sum(apys);
        const faucetAddresses = compact(tokenFaucets.map(tokenFaucet => tokenFaucet.tokenFaucetAddress));

        const ticket: AppTokenPosition<PoolTogetherV3TicketTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          address: ticketAddress,
          appId: POOL_TOGETHER_DEFINITION.id,
          groupId: POOL_TOGETHER_DEFINITION.groups.v3.id,
          network,
          symbol: ticketSymbol,
          decimals: ticketDecimals,
          supply: ticketSupply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            apy,
            liquidity: liquidityTicket,
            faucetAddresses,
          },

          displayProps: {
            label: ticketSymbol,
            secondaryLabel,
            images,
            statsItems: [
              {
                label: 'APY',
                value: buildPercentageDisplayItem(apy),
              },
              {
                label: 'Liquidity',
                value: buildDollarDisplayItem(liquidityTicket),
              },
            ],
          },
        };

        const sponsorship: AppTokenPosition<PoolTogetherV3TicketTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          address: sponsorshipAddress,
          appId: POOL_TOGETHER_DEFINITION.id,
          groupId: POOL_TOGETHER_DEFINITION.groups.v3.id,
          network,
          symbol: sponsorshipSymbol,
          decimals: ticketDecimals,
          supply: sponsorshipSupply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            apy,
            liquidity: liquiditySponsorship,
            faucetAddresses,
          },

          displayProps: {
            label: sponsorshipSymbol,
            secondaryLabel,
            images,
            statsItems: [
              {
                label: 'APY',
                value: buildPercentageDisplayItem(apy),
              },
              {
                label: 'Liquidity',
                value: buildDollarDisplayItem(liquiditySponsorship),
              },
            ],
          },
        };

        return [ticket, sponsorship];
      }),
    );

    return compact(vaultTokens.flat());
  }
}
