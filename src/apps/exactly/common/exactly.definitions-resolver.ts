import { Inject, Injectable } from '@nestjs/common';
import { constants } from 'ethers';

import { ViemMulticallDataLoader } from '~multicall';
import { Network } from '~types/network.interface';

import { ExactlyViemContractFactory } from '../contracts';

export const PREVIEWER_ADDRESSES = {
  [Network.ETHEREUM_MAINNET]: '0x5fe09baaa75fd107a8df8565813f66b3603a13d3',
  [Network.OPTIMISM_MAINNET]: '0xb8b1f590272b541b263a49b28bf52f8774b0e6c9',
} as Partial<Record<Network, string>>;

export type ExactlyMarketDefinition = any;
export type GetMarketDefinitionsParams = { network: Network; multicall: ViemMulticallDataLoader; account?: string };

@Injectable()
export class ExactlyDefinitionsResolver {
  constructor(@Inject(ExactlyViemContractFactory) protected readonly contractFactory: ExactlyViemContractFactory) {}

  async getDefinitions({ multicall, network, account }: GetMarketDefinitionsParams) {
    const address = PREVIEWER_ADDRESSES[network];
    if (!address) throw new Error(`missing previewer on ${network}`);

    const previewer = this.contractFactory.previewer({ address, network });
    const ts = await multicall.wrap(multicall.contract).read.getCurrentBlockTimestamp();
    const exactly = await multicall.wrap(previewer).read.exactly([account ?? constants.AddressZero]);

    const definitions = exactly.map(m => ({
      address: m.market.toLowerCase(),
      timestamp: Number(ts),
      ...m,
    }));

    return definitions;
  }

  async getDefinition(params: GetMarketDefinitionsParams & { market: string }) {
    const definitions = await this.getDefinitions(params);
    const definition = definitions.find(({ address }) => address === params.market.toLowerCase());
    if (!definition) throw new Error(`missing definition for ${params.market}`);
    return definition;
  }
}
