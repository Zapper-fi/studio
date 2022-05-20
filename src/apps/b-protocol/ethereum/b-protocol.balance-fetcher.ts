import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { B_PROTOCOL_DEFINITION } from '..';
import { CompoundBProtocolAdapter } from '../adapters/compound.b-protocol-adapter';
import { LiquityBProtocolAdapter } from '../adapters/liquity.b-protocol-adapter';
import { MakerBProtocolAdapter } from '../adapters/maker.b-protocol.adapter';

const appId = B_PROTOCOL_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class EthereumBProtocolBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(CompoundBProtocolAdapter) private readonly compoundBProtocolAdapter: CompoundBProtocolAdapter,
    @Inject(LiquityBProtocolAdapter) private readonly liquityBProtocolAdapter: LiquityBProtocolAdapter,
    @Inject(MakerBProtocolAdapter) private readonly makerBProtocolAdapter: MakerBProtocolAdapter,
  ) {}

  async getBalances(address: string) {
    const [compound, liquity, maker] = await Promise.all([
      this.compoundBProtocolAdapter.getBalances(address),
      this.liquityBProtocolAdapter.getBalances(address),
      this.makerBProtocolAdapter.getBalances(address),
    ]);

    return presentBalanceFetcherResponse(
      compact([compound, liquity, maker]).map(({ assets, ...rest }) => ({
        assets: assets.map(asset => ({
          ...asset,
          // Force all App IDs and Group IDs to B. Protocol
          appId: B_PROTOCOL_DEFINITION.id,
          groupId: B_PROTOCOL_DEFINITION.groups.deposit.id,
        })),
        ...rest,
      })),
    );
  }
}
