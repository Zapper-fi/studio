import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MetavaultTradeContractFactory } from '../contracts';
import { METAVAULT_TRADE_DEFINITION } from '../metavault-trade.definition';

type GetMetavaultTradeEsMvxTokenParams = {
  network: Network;
  esMvxTokenAddress: string;
};

@Injectable()
export class MetavaultTradeEsMvxTokenHelper {
  constructor(
    @Inject(MetavaultTradeContractFactory) private readonly contractFactory: MetavaultTradeContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getTokens({ network, esMvxTokenAddress }: GetMetavaultTradeEsMvxTokenParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const underlyingToken = baseTokens.find(p => p.symbol === 'MVX')!;

    const esMvxContract = this.contractFactory.erc20({ address: esMvxTokenAddress, network });
    const [symbol, decimals, supplyRaw] = await Promise.all([
      multicall.wrap(esMvxContract).symbol(),
      multicall.wrap(esMvxContract).decimals(),
      multicall.wrap(esMvxContract).totalSupply(),
    ]);

    // Data Props
    const pricePerShare = 1; // Minted 1:1
    const supply = Number(supplyRaw) / 10 ** 18;
    const price = pricePerShare * underlyingToken.price;
    const tokens = [underlyingToken];
    const liquidity = price * supply;

    // Display Props
    const label = symbol;
    const secondaryLabel = buildDollarDisplayItem(price);
    const images = [getTokenImg(underlyingToken.address, network)];

    const vaultToken: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      address: esMvxTokenAddress,
      appId: METAVAULT_TRADE_DEFINITION.id,
      groupId: METAVAULT_TRADE_DEFINITION.groups.esMvx.id,
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

    return [vaultToken];
  }
}
