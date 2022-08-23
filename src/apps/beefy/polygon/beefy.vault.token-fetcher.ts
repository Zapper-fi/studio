import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { BEEFY_DEFINITION } from '../beefy.definition';
import { BeefyContractFactory, BeefyVaultToken } from '../contracts';
import { BeefyVaultTokenFetcher } from '../helpers/beefy.vault-token-fetcher';
import { BeefyVaultTokenDefinitionsResolver } from '../helpers/beefy.vault.token-definition-resolver';

const appId = BEEFY_DEFINITION.id;
const groupId = BEEFY_DEFINITION.groups.vault.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonBeefyVaultTokenFetcher extends BeefyVaultTokenFetcher<BeefyVaultToken> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BeefyContractFactory) protected readonly contractFactory: BeefyContractFactory,
    @Inject(BeefyVaultTokenDefinitionsResolver) tokenDefinitionsResolver: BeefyVaultTokenDefinitionsResolver,
  ) {
    super(appToolkit, tokenDefinitionsResolver, contractFactory);
  }

  getContract(address: string): BeefyVaultToken {
    return this.contractFactory.beefyVaultToken({ network: this.network, address });
  }
}
