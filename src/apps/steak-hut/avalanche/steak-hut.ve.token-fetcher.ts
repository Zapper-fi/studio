import { Inject, Injectable } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { SteakHutContractFactory, SteakHutHjoe } from '../contracts';
import { STEAK_HUT_DEFINITION } from '../steak-hut.definition';

@Injectable()
export class AvalancheSteakHutVeTokenFetcher extends AppTokenTemplatePositionFetcher<SteakHutHjoe> {
  appId = STEAK_HUT_DEFINITION.id;
  groupId = STEAK_HUT_DEFINITION.groups.ve.id;
  network = Network.AVALANCHE_MAINNET;
  groupLabel = 'VotedEscrow';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SteakHutContractFactory) protected readonly contractFactory: SteakHutContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SteakHutHjoe {
    return this.contractFactory.steakHutHjoe({ address, network: this.network });
  }

  getAddresses() {
    return ['0xe7250b05bd8dee615ecc681eda1196add5156f2b'];
  }

  getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<SteakHutHjoe>) {
    return contract.JOE();
  }
}
