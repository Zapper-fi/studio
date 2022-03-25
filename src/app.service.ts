import { Inject, Injectable } from '@nestjs/common';

import { AppToolkit } from '~app-toolkit/app-toolkit.service';
import { Network } from '~types/network.interface';

@Injectable()
export class AppService {
  constructor(@Inject(AppToolkit) private readonly appToolkit: AppToolkit) {}

  async getHello() {
    const erc = this.appToolkit.globalContracts.erc20({
      network: Network.ETHEREUM_MAINNET,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    });

    const multicall = this.appToolkit.getMulticall(Network.ETHEREUM_MAINNET);
    const usdcSymbol = await multicall.wrap(erc).symbol();

    const positions = await this.appToolkit.getAppTokens({
      appId: 'uniswap-v2',
      groupIds: ['pool'],
      network: Network.ETHEREUM_MAINNET,
    });

    return {
      usdcSymbol,
      positions,
    };
  }
}
