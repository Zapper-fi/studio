import { Injectable } from '@nestjs/common';
import { type BigNumber, constants } from 'ethers';

import type { IMulticallWrapper } from '~multicall/multicall.interface';
import type { DefaultAppTokenDefinition } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { type Previewer, Previewer__factory } from '../contracts/ethers';

export const PREVIEWER_ADDRESSES = {
  [Network.ETHEREUM_MAINNET]: '0x5fe09baaa75fd107a8df8565813f66b3603a13d3',
  [Network.OPTIMISM_MAINNET]: '0xb8b1f590272b541b263a49b28bf52f8774b0e6c9',
} as Partial<Record<Network, string>>;

export type ExactlyMarketDefinition = DefaultAppTokenDefinition &
  Previewer.MarketAccountStructOutput & { blockNumber: number; timestamp: number };
export type GetMarketDefinitionsParams = { network: Network; multicall: IMulticallWrapper; account?: string };

@Injectable()
export class ExactlyDefinitionsResolver {
  async getDefinitions({ multicall, network, account }: GetMarketDefinitionsParams) {
    const address = PREVIEWER_ADDRESSES[network];
    if (!address) throw new Error(`missing previewer on ${network}`);
    const previewer = Previewer__factory.createInterface();
    const { address: multicallAddress, interface: multicallInterface } = multicall.contract;
    const [block, [{ data: exactly }, { data: ts }]] = await multicall.wrap(multicall.contract).callStatic.aggregate(
      [
        { target: address, callData: previewer.encodeFunctionData('exactly', [account ?? constants.AddressZero]) },
        { target: multicallAddress, callData: multicallInterface.encodeFunctionData('getCurrentBlockTimestamp') },
      ],
      true,
    );
    const blockNumber = block.toNumber();
    const timestamp = (
      multicall.contract.interface.decodeFunctionResult('getCurrentBlockTimestamp', ts)[0] as BigNumber
    ).toNumber();
    return (previewer.decodeFunctionResult('exactly', exactly)[0] as Previewer.MarketAccountStructOutput[]).map(
      m => ({ address: m.market.toLowerCase(), blockNumber, timestamp, ...m } as ExactlyMarketDefinition),
    );
  }

  async getDefinition(params: GetMarketDefinitionsParams & { market: string }) {
    const definitions = await this.getDefinitions(params);
    const definition = definitions.find(({ address }) => address === params.market.toLowerCase());
    if (!definition) throw new Error(`missing definition for ${params.market}`);
    return definition;
  }
}
