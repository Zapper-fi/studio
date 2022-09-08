import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { CompoundSupplyTokenFetcher } from '../common/compound.supply.token-fetcher';
import { COMPOUND_DEFINITION } from '../compound.definition';
import { CompoundContractFactory } from '../contracts';

@Injectable()
export class EthereumCompoundSupplyTokenFetcher extends CompoundSupplyTokenFetcher {
  appId = COMPOUND_DEFINITION.id;
  groupId = COMPOUND_DEFINITION.groups.supply.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Lending';
  comptrollerAddress = '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CompoundContractFactory) protected readonly contractFactory: CompoundContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.compoundCToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.compoundComptroller({ address, network: this.network });
  }
}
