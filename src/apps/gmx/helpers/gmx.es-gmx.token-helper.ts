import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { GmxContractFactory } from '../contracts';
import { GMX_DEFINITION } from '../gmx.definition';

type GetGmxEsGmxTokenParams = {
  network: Network;
  esGmxTokenAddress: string;
};

@Injectable()
export class GmxEsGmxTokenHelper {
  constructor(
    @Inject(GmxContractFactory) private readonly contractFactory: GmxContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getTokens({ network, esGmxTokenAddress }: GetGmxEsGmxTokenParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const underlyingToken = baseTokens.find(p => p.symbol === 'GMX')!;

    const esGmxContract = this.contractFactory.erc20({ address: esGmxTokenAddress, network });
    const [symbol, decimals, supplyRaw] = await Promise.all([
      multicall.wrap(esGmxContract).symbol(),
      multicall.wrap(esGmxContract).decimals(),
      multicall.wrap(esGmxContract).totalSupply(),
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
      address: esGmxTokenAddress,
      appId: GMX_DEFINITION.id,
      groupId: GMX_DEFINITION.groups.esGmx.id,
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
