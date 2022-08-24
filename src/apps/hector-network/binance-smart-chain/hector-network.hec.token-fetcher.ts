import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { HectorNetworkContractFactory } from '../contracts';
import { HECTOR_NETWORK_DEFINITION } from '../hector-network.definition';

const appId = HECTOR_NETWORK_DEFINITION.id;
const groupId = HECTOR_NETWORK_DEFINITION.groups.hec.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainHectorNetworkHecTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(HectorNetworkContractFactory) private readonly hectorNetworkContractFactory: HectorNetworkContractFactory,
  ) {}

  async getPositions() {
    const tokenAddresses = [
      '0x638eebe886b0e9e7c6929e69490064a6c94d204d', // hec
      '0x1d6cbdc6b29c6afbae65444a1f65ba9252b8ca83', // tor
    ];

    // Build out the token objects
    const multicall = this.appToolkit.getMulticall(network);
    const tokens = await Promise.all(
      tokenAddresses.map(async tokenAddress => {
        const contract = this.hectorNetworkContractFactory.hectorNetworkToken({
          address: tokenAddress,
          network,
        });

        // Request the symbol, decimals, ands supply for the jar token
        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
        ]);

        // Denormalize the supply
        const supply = Number(supplyRaw) / 10 ** decimals;

        // Create the token object
        const token = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: tokenAddress,
          network,
          symbol,
          decimals,
          supply,
        };

        return token;
      }),
    );

    return tokens as any;
  }
}
