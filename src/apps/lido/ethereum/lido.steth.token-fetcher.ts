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
const groupId = LIDO_DEFINITION.groups.steth.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumLidoStethTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LidoContractFactory) private readonly lidoContractFactory: LidoContractFactory,
  ) {}

  async getPositions() {
    const address = '0xae7ab96520de3a18e5e111b5eaab095312d7fe84';
    const multicall = this.appToolkit.getMulticall(network);
    const contract = this.lidoContractFactory.steth({ address: address, network });
    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);
    const stethToken = baseTokenDependencies.find(v => v.symbol === 'stETH')!;
    const [symbol, decimals, totalSupply] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
    ]);
    const supply = Number(totalSupply) / 10 ** decimals;
    const liquidity = stethToken.price * Number(totalSupply);
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
      price: stethToken.price,
      type: ContractType.APP_TOKEN,
      displayProps: {
        label: symbol,
        secondaryLabel: buildDollarDisplayItem(stethToken.price),
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
