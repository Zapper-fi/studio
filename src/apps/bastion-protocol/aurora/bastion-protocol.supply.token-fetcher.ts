import { Inject } from '@nestjs/common';
import { formatUnits } from 'ethers/lib/utils';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem, buildPercentageDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { BalanceDisplayMode } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition, ExchangeableAppTokenDataProps } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BASTION_PROTOCOL_DEFINITION } from '../bastion-protocol.definition';
import { BastionProtocolContractFactory } from '../contracts';

const appId = BASTION_PROTOCOL_DEFINITION.id;
const groupId = BASTION_PROTOCOL_DEFINITION.groups.supply.id;
const network = Network.AURORA_MAINNET;

export type BastionSupplyTokenDataProps = ExchangeableAppTokenDataProps & {
  supplyApy: number;
  borrowApy: number;
  liquidity: number;
  marketName?: string;
  comptrollerAddress: string;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AuroraBastionProtocolSupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BastionProtocolContractFactory)
    private readonly bastionProtocolContractFactory: BastionProtocolContractFactory,
  ) { }

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const comptrollerAddress = "0x6De54724e128274520606f038591A00C5E94a1F6"
    const comptrollerContract =
      this.bastionProtocolContractFactory.bastionProtocolComptroller(
        {
          address: comptrollerAddress,
          network
        }
      );
    const marketTokenAddressesRaw = await multicall.wrap(comptrollerContract).getAllMarkets();

    const tokens = await Promise.all(
      marketTokenAddressesRaw.map(async marketTokenAddressRaw => {
        const address = marketTokenAddressRaw.toLowerCase();
        const erc20TokenContract = this.bastionProtocolContractFactory.erc20({ address, network });
        const contract = this.bastionProtocolContractFactory.bastionProtocolCtoken({ address, network });

        const underlyingAddress = await multicall.wrap(contract).underlying()
          .then(t => t.toLowerCase().replace(ETH_ADDR_ALIAS, ZERO_ADDRESS))
          .catch(() => ZERO_ADDRESS);

        const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
        const allTokens = [...baseTokens];

        const underlyingToken = allTokens.find(v => v.address === underlyingAddress);
        if (!underlyingToken) return null;

        const [symbol, decimals, supplyRaw, rateRaw, supplyRateRaw, borrowRateRaw] = await Promise.all([
          multicall.wrap(erc20TokenContract).symbol(),
          multicall.wrap(erc20TokenContract).decimals(),
          multicall.wrap(erc20TokenContract).totalSupply(),
          multicall.wrap(contract).callStatic.exchangeRateCurrent(),
          multicall.wrap(contract).supplyRatePerBlock(),
          multicall.wrap(contract).borrowRatePerBlock(),
        ]);

        // Data Props
        const type = ContractType.APP_TOKEN;
        const supply = Number(supplyRaw) / 10 ** decimals;
        const underlyingTokenDecimals = underlyingToken.decimals;
        // The exchange rate has (18 - 8 + UnderlyingTokenDecimals) decimals
        const mantissa = underlyingTokenDecimals + 10;
        const pricePerShare = Number(rateRaw) / 10 ** mantissa;
        const price = pricePerShare * underlyingToken.price;
        const liquidity = price * supply;
        const tokens = [underlyingToken];
        const secondsPerDay = 60 * 60 * 24;
        const supplyRate = formatUnits(supplyRateRaw, 18);
        const borrowRate = formatUnits(borrowRateRaw, 18);

        const supplyApy = Math.pow(1 + secondsPerDay * Number(supplyRate), 365) - 1;
        const borrowApy = Math.pow(1 + secondsPerDay * Number(borrowRate), 365) - 1;

        // Display Props
        const label = underlyingToken.symbol;
        const secondaryLabel = buildDollarDisplayItem(underlyingToken.price);
        const tertiaryLabel = `${(supplyApy * 100).toFixed(3)}% APY`;
        const images = [getTokenImg(underlyingToken.address, network)];
        const balanceDisplayMode = BalanceDisplayMode.UNDERLYING;
        const statsItems = [
          { label: 'Supply APY', value: buildPercentageDisplayItem(supplyApy) },
          { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
        ];

        const token: AppTokenPosition<BastionSupplyTokenDataProps> = {
          type,
          appId,
          groupId,
          address,
          network,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            marketName: undefined,
            supplyApy,
            borrowApy,
            liquidity,
            comptrollerAddress,
            exchangeable: false,
          },

          displayProps: {
            label,
            secondaryLabel,
            tertiaryLabel,
            images,
            statsItems,
            balanceDisplayMode,
          },
        };

        return token;
      }),
    );
    return compact(tokens);
  }
}
