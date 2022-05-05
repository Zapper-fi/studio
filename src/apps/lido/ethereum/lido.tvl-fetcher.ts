import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { LidoContractFactory } from '../contracts';
import LIDO_DEFINITION from '../lido.definition';

const appId = LIDO_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TvlFetcher({ appId, network })
export class EthereumLidoTvlFetcher implements TvlFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LidoContractFactory) private readonly lidoContractFactory: LidoContractFactory,
  ) {}

  async getTvl() {
    const stethAddress = '0xae7ab96520de3a18e5e111b5eaab095312d7fe84';
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const stethToken = baseTokens.find(v => v.symbol === 'stETH')!;
    const contract = this.lidoContractFactory.steth({ address: stethAddress, network });
    const multicall = this.appToolkit.getMulticall(network);
    const [decimals, totalSupply] = await Promise.all([
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
    ]);
    return (Number(totalSupply) / 10 ** decimals) * stethToken.price;
  }
}
