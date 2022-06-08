import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { LidoContractFactory } from '../contracts';
import { LIDO_DEFINITION } from '../lido.definition';

const appId = LIDO_DEFINITION.id;
const groupId = LIDO_DEFINITION.groups.wsteth.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumLidoWstethTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LidoContractFactory) private readonly lidoContractFactory: LidoContractFactory,
  ) {}

  async getPositions() {
    const address = '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0';
    const multicall = this.appToolkit.getMulticall(network);
    const contract = this.lidoContractFactory.steth({ address: address, network });
    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);
    const wstethToken = baseTokenDependencies.find(v => v.symbol === 'wstETH')!;
    const [symbol, decimals, totalSupply] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
    ]);
    const supply = Number(totalSupply) / 10 ** decimals;
    const liquidity = wstethToken.price * supply;
    const token: AppTokenPosition = {
      address,
      network,
      appId,
      groupId,
      symbol,
      decimals,
      supply,
      tokens: [],
      dataProps: {},
      pricePerShare: 1,
      price: wstethToken.price,
      type: ContractType.APP_TOKEN,
      displayProps: {
        label: symbol,
        secondaryLabel: buildDollarDisplayItem(wstethToken.price),
        images: [getTokenImg(address, network)],
        statsItems: [
          {
            label: 'Liquidity',
            value: buildDollarDisplayItem(liquidity),
          },
        ],
      },
    };

    return [token];
  }
}
