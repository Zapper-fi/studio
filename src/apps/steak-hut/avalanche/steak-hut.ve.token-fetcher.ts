import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensStageParams } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { SteakHutContractFactory, SteakHutHjoe } from '../contracts';
import { STEAK_HUT_DEFINITION } from '../steak-hut.definition';

const appId = STEAK_HUT_DEFINITION.id;
const groupId = STEAK_HUT_DEFINITION.groups.ve.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheSteakHutVeTokenFetcher extends AppTokenTemplatePositionFetcher<SteakHutHjoe> {
  appId = appId;
  groupId = groupId;
  network = network;
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

  getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensStageParams<SteakHutHjoe>) {
    return contract.JOE();
  }
}
