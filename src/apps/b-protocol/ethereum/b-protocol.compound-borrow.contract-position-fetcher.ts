import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { CompoundContractFactory, COMPOUND_DEFINITION } from '~apps/compound';
import { CompoundBorrowTokenDataProps } from '~apps/compound/common/compound.borrow.contract-position-fetcher';
import { EthereumCompoundBorrowContractPositionFetcher } from '~apps/compound/ethereum/compound.borrow.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { B_PROTOCOL_DEFINITION } from '../b-protocol.definition';
import { BProtocolContractFactory } from '../contracts';

export class EthereumBProtocolCompoundBorrowContractPositionFetcher extends EthereumCompoundBorrowContractPositionFetcher {
  appId = B_PROTOCOL_DEFINITION.id;
  groupId = B_PROTOCOL_DEFINITION.groups.compoundBorrow.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Compound Lending';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CompoundContractFactory) protected readonly compoundContractFactory: CompoundContractFactory,
    @Inject(BProtocolContractFactory) protected readonly bProtocolContractFactory: BProtocolContractFactory,
  ) {
    super(appToolkit, compoundContractFactory);
  }

  async getDefinitions() {
    return [];
  }

  async getAccountAddress(address: string): Promise<string> {
    const registry = this.bProtocolContractFactory.bProtocolCompoundRegistry({
      address: '0xbf698df5591caf546a7e087f5806e216afed666a',
      network: this.network,
    });

    const avatarAddress = await registry.avatarOf(address);
    return avatarAddress;
  }

  async getPositionsForBalances() {
    const positions = await this.appToolkit.getAppContractPositions<CompoundBorrowTokenDataProps>({
      appId: COMPOUND_DEFINITION.id,
      groupIds: [COMPOUND_DEFINITION.groups.borrow.id],
      network: this.network,
    });

    return positions.map(position => {
      const appGroupNetwork = { appId: this.appId, groupId: this.groupId, network: this.network };
      const proxiedContractPosition = { ...position, ...appGroupNetwork };
      proxiedContractPosition.key = this.getKey({ contractPosition: proxiedContractPosition });
      return proxiedContractPosition;
    });
  }
}
