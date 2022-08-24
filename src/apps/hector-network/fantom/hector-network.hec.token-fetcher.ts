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
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomHectorNetworkHecTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(HectorNetworkContractFactory) private readonly hectorNetworkContractFactory: HectorNetworkContractFactory,
  ) {}

  async getPositions() {
    const tokenAddresses = [
      '0x5c4fdfc5233f935f20d2adba572f770c2e377ab0', // hec
      '0x74e23df9110aa9ea0b6ff2faee01e740ca1c642e', // tor
      '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e', // dai
      '0x04068da6c83afcfa0e13ba15a6696662335d5b75', // usdc
      '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', // wftm
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
