import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { BADGER_DEFINITION } from '../badger.definition';
import { BadgerContractFactory, BadgerSett } from '../contracts';
import { BadgerVaultTokenDefinitionsResolver } from '../helpers/badger.vault.token-definition-resolver';
import { BadgerVaultTokenFetcher } from '../helpers/badger.vault.token-fetcher';

const appId = BADGER_DEFINITION.id;
const groupId = BADGER_DEFINITION.groups.vault.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumBadgerVaultTokenFetcher extends BadgerVaultTokenFetcher<BadgerSett> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BadgerContractFactory) protected readonly contractFactory: BadgerContractFactory,
    @Inject(BadgerVaultTokenDefinitionsResolver) tokenDefinitionsResolver: BadgerVaultTokenDefinitionsResolver,
  ) {
    super(appToolkit, tokenDefinitionsResolver, contractFactory);
  }

  getContract(address: string): BadgerSett {
    return this.contractFactory.badgerSett({ network: this.network, address });
  }
}
