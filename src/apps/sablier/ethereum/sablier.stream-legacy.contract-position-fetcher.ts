import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import {
  ContractPositionTemplatePositionFetcher,
  DisplayPropsStageParams,
} from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types';

import { SablierContractFactory, SablierStream } from '../contracts';
import { SABLIER_DEFINITION } from '../sablier.definition';

type SablierContractPositionDataProps = {
  deposited: number;
  remaining: number;
};

const appId = SABLIER_DEFINITION.id;
const groupId = SABLIER_DEFINITION.groups.streamLegacy.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumSablierStreamLegacyContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  SablierStream,
  SablierContractPositionDataProps
> {
  appId = SABLIER_DEFINITION.id;
  groupId = SABLIER_DEFINITION.groups.streamLegacy.id;
  network = Network.ETHEREUM_MAINNET;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SablierContractFactory) protected readonly contractFactory: SablierContractFactory,
  ) {
    super(appToolkit);
  }

  async getAddresses() {
    return ['0xa4fc358455febe425536fd1878be67ffdbdec59a'];
  }

  getContract(address: string): SablierStream {
    return this.contractFactory.sablierStream({ address, network: this.network });
  }

  async getLabel({ appToken }: DisplayPropsStageParams<SablierStream, SablierContractPositionDataProps>) {
    return `${getLabelFromToken(appToken.tokens[0])} in Sablier (Legacy)`;
  }
}
