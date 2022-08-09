import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import {
  ContractPositionTemplatePositionFetcher,
  DisplayPropsStageParams,
  TokensStageParams,
} from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types';

import { SablierStreamApiClient } from '../common/sablier.stream.api-client';
import { SablierContractFactory, SablierStream } from '../contracts';
import { SABLIER_DEFINITION } from '../sablier.definition';

export type SablierStreamLegacyContractPositionDataProps = {
  deposited: number;
  remaining: number;
};

export type SablierStreamLegacyContractPositionDescriptor = {
  address: string;
  tokenAddress: string;
};

const appId = SABLIER_DEFINITION.id;
const groupId = SABLIER_DEFINITION.groups.streamLegacy.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumSablierStreamLegacyContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  SablierStream,
  SablierStreamLegacyContractPositionDataProps,
  SablierStreamLegacyContractPositionDescriptor
> {
  appId = SABLIER_DEFINITION.id;
  groupId = SABLIER_DEFINITION.groups.streamLegacy.id;
  network = Network.ETHEREUM_MAINNET;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SablierContractFactory) protected readonly contractFactory: SablierContractFactory,
    @Inject(SablierStreamApiClient) protected readonly apiClient: SablierStreamApiClient,
  ) {
    super(appToolkit);
  }

  async getDescriptors() {
    const tokens = await this.apiClient.getTokens();
    const streamAddress = '0xa4fc358455febe425536fd1878be67ffdbdec59a';
    return tokens.map(v => ({ address: streamAddress, tokenAddress: v }));
  }

  getContract(address: string): SablierStream {
    return this.contractFactory.sablierStream({ address, network: this.network });
  }

  async getTokenDescriptors({
    descriptor,
  }: TokensStageParams<SablierStream, SablierStreamLegacyContractPositionDescriptor>) {
    return [{ address: descriptor.tokenAddress, metaType: MetaType.SUPPLIED }];
  }

  async getLabel({ appToken }: DisplayPropsStageParams<SablierStream, SablierStreamLegacyContractPositionDataProps>) {
    return `${getLabelFromToken(appToken.tokens[0])} Sablier Stream`;
  }
}
