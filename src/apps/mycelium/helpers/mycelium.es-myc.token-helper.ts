import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MyceliumContractFactory } from '../contracts';
import { MYCELIUM_DEFINITION } from '../mycelium.definition';

import { ES_MYC_TOKEN_ADDRESS } from './mycelium.constants';

type MyceliumEsMycTokenParams = {
  network: Network;
};

@Injectable()
export class MyceliumEsMycTokenHelper {
  constructor(
    @Inject(MyceliumContractFactory) private readonly contractFactory: MyceliumContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getTokens({ network }: MyceliumEsMycTokenParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const underlyingToken = baseTokens.find(p => p.symbol === 'MYC')!;
    if (!underlyingToken) return [];

    const esMycContract = this.contractFactory.erc20({ address: ES_MYC_TOKEN_ADDRESS, network });
    const [symbol, decimals, supplyRaw] = await Promise.all([
      multicall.wrap(esMycContract).symbol(),
      multicall.wrap(esMycContract).decimals(),
      multicall.wrap(esMycContract).totalSupply(),
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
      address: ES_MYC_TOKEN_ADDRESS,
      appId: MYCELIUM_DEFINITION.id,
      groupId: MYCELIUM_DEFINITION.groups.esMyc.id,
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
