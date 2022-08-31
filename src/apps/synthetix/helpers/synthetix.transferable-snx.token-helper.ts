import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SynthetixContractFactory } from '../contracts';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

export type SynthetixSynthTokenHelperParams = {
  network: Network;
};

@Injectable()
export class SynthetixTransferrableSnxTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) private readonly contractFactory: SynthetixContractFactory,
  ) {}

  async getTokens({ network }: SynthetixSynthTokenHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const snxToken = baseTokens.find(p => p.symbol === 'SNX')!;
    const snxContract = this.contractFactory.synthetixNetworkToken(snxToken);
    const supplyRaw = await multicall.wrap(snxContract).totalSupply();

    const snxAppToken: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId: SYNTHETIX_DEFINITION.id,
      groupId: SYNTHETIX_DEFINITION.groups.transferableSnx.id,
      network: network,
      address: snxToken.address,
      decimals: snxToken.decimals,
      symbol: snxToken.symbol,
      supply: Number(supplyRaw) / 10 ** snxToken.decimals,
      price: snxToken.price,
      pricePerShare: 1,
      tokens: [],

      dataProps: {
        exchangeable: true,
      },

      displayProps: {
        label: snxToken.symbol,
        secondaryLabel: buildDollarDisplayItem(snxToken.price),
        images: [getTokenImg(snxToken.address, network)],
      },
    };

    return [snxAppToken];
  }
}
