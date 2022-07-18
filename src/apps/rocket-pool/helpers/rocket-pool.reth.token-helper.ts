import { Inject, Injectable } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { RocketPoolContractFactory } from '../contracts';
import { ROCKET_POOL_DEFINITION } from '../rocket-pool.definition';

const groupId = ROCKET_POOL_DEFINITION.groups.reth.id;

@Injectable()
export class RocketPoolRethTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(RocketPoolContractFactory) private readonly rocketPoolContractFactory: RocketPoolContractFactory,
  ) {}

  async getPositions({ appId, network, address }: { appId: string; network: Network; address: string }) {
    const multicall = this.appToolkit.getMulticall(network);

    const contract = this.rocketPoolContractFactory.erc20({
      address,
      network,
    });

    const [symbol, decimals, supplyRaw] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
    ]);

    const supply = Number(supplyRaw) / 10 ** decimals;

    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);
    const rethToken = baseTokenDependencies.find(v => v.symbol === 'rETH')!;

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address,
      network,
      symbol,
      decimals,
      supply,
      price: rethToken.price,
      pricePerShare: 1,
      dataProps: {},
      displayProps: {
        label: symbol,
        secondaryLabel: buildDollarDisplayItem(rethToken.price),
        images: [getTokenImg(address, network)],
      },
      tokens: [],
    };

    return [token];
  }
}
