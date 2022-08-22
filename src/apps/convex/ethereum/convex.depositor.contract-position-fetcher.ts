import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import {
  ContractPositionTemplatePositionFetcher,
  DisplayPropsStageParams,
  TokenStageParams,
} from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types/network.interface';

import { ConvexContractFactory } from '../contracts';
import { ConvexDepositor } from '../contracts/ethers/ConvexDepositor';
import { CONVEX_DEFINITION } from '../convex.definition';

const appId = CONVEX_DEFINITION.id;
const groupId = CONVEX_DEFINITION.groups.depositor.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { excludeFromTvl: true } })
export class EthereumConvexDepositorContractPositionFetcher extends ContractPositionTemplatePositionFetcher<ConvexDepositor> {
  appId = appId;
  groupId = groupId;
  network = network;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConvexContractFactory) protected readonly contractFactory: ConvexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ConvexDepositor {
    return this.contractFactory.convexDepositor({ address, network: this.network });
  }

  async getDescriptors() {
    return [{ address: '0x8014595f2ab54cd7c604b00e9fb932176fdc86ae' }];
  }

  async getTokenDescriptors(_params: TokenStageParams<ConvexDepositor>) {
    return [{ metaType: MetaType.SUPPLIED, address: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b' }];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<ConvexDepositor>) {
    const depositToken = contractPosition.tokens[0]!;
    return `${getLabelFromToken(depositToken)} Depositor`;
  }

  async getTokenBalancesPerPosition() {
    return [0];
  }
}
