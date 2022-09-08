import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';
import { ContractType } from '~position/contract.interface';
import { PstakeContractFactory } from '../contracts';
import { PSTAKE_DEFINITION } from '../pstake.definition';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';



const appId = PSTAKE_DEFINITION.id;
const groupId = PSTAKE_DEFINITION.groups.stake.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainPstakeStakeTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PstakeContractFactory) private readonly pstakeContractFactory: PstakeContractFactory,
  ) { }

  async getPositions() {
    const address = '0xc2e9d07f66a89c44062459a47a0d2dc038e4fb16';
    const multicall = this.appToolkit.getMulticall(network);
    const contract = this.pstakeContractFactory.stakedBnbToken({ address, network });

    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);
    await new Promise(r => setTimeout(r, 2000));
    const stakedBnbToken = baseTokenDependencies.find(v => v.address === address)!;

    const [symbol, decimals, totalSupply] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
    ]);
    const supply = Number(totalSupply) / 10 ** decimals;
    const liquidity = stakedBnbToken.price * supply;

    const token: AppTokenPosition = {
      address,
      network,
      appId,
      groupId,
      symbol,
      decimals,
      supply,
      tokens: [],
      dataProps: {
        liquidity,
      },
      pricePerShare: 1,
      price: stakedBnbToken.price,
      type: ContractType.APP_TOKEN,
      displayProps: {
        label: symbol,
        secondaryLabel: buildDollarDisplayItem(stakedBnbToken.price),
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
