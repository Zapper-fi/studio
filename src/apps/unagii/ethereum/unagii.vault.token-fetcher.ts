import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { UnagiiVaultTokenFetcher } from '../common/unagii.vault-token-fetcher';
import { UnagiiContractFactory } from '../contracts';
import { UNAGII_DEFINITION } from '../unagii.definition';

const appId = UNAGII_DEFINITION.id;
const groupId = UNAGII_DEFINITION.groups.vault.id;
const network = Network.ETHEREUM_MAINNET;

export type UnagiiTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
  vaultManagerAddress: string;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumUnagiiVaultTokenFetcher extends UnagiiVaultTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Vaults';
  vaultManagerAddresses = [
    '0x7f75d72886d6a8677321e5602d18948abcb4281a',
    '0xb088d7c71ea9ebaed981c103fc3019b59950d2c9',
    '0x8ef11c51a666c53aeeec504f120cd1435e451342',
  ];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UnagiiContractFactory) protected readonly contractFactory: UnagiiContractFactory,
  ) {
    super(appToolkit, contractFactory);
  }
}
