import { Inject, Injectable } from '@nestjs/common';
import { constants } from 'ethers';

import type { IMulticallWrapper } from '~multicall/multicall.interface';
import type { DefaultAppTokenDefinition } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { ExactlyContractFactory } from '../contracts';
import type { Previewer } from '../contracts';

export const PREVIEWER_ADDRESSES = {
  [Network.ETHEREUM_MAINNET]: '0x0aa3529ae5fdbceb69cf8ab2b9e2d3af85860469',
} as Partial<Record<Network, string>>;

export type ExactlyMarketDefinition = DefaultAppTokenDefinition & Omit<Previewer.MarketAccountStructOutput, 'address'>;
export type GetMarketDefinitionsParams = { network: Network; multicall: IMulticallWrapper; account?: string };

@Injectable()
export class ExactlyDefinitionsResolver {
  constructor(@Inject(ExactlyContractFactory) protected readonly contractFactory: ExactlyContractFactory) {}

  async getDefinitions({ multicall, network, account }: GetMarketDefinitionsParams) {
    const address = PREVIEWER_ADDRESSES[network];
    if (!address) throw new Error(`missing previewer on ${network}`);
    const exactly = await multicall
      .wrap(this.contractFactory.previewer({ address, network }))
      .exactly(account ?? constants.AddressZero);
    return exactly.map(m => ({ address: m.market.toLowerCase(), ...m } as ExactlyMarketDefinition));
  }

  async getDefinition(params: GetMarketDefinitionsParams & { market: string }) {
    const definitions = await this.getDefinitions(params);
    const definition = definitions.find(({ address }) => address === params.market.toLowerCase());
    if (!definition) throw new Error(`missing definition for ${params.market}`);
    return definition;
  }
}
