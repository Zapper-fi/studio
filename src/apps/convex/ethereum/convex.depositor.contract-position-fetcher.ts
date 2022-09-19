import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

import { ConvexContractFactory } from '../contracts';
import { ConvexDepositor } from '../contracts/ethers/ConvexDepositor';

@PositionTemplate()
export class EthereumConvexDepositorContractPositionFetcher extends ContractPositionTemplatePositionFetcher<ConvexDepositor> {
  groupLabel = 'Depositor';

  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConvexContractFactory) protected readonly contractFactory: ConvexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ConvexDepositor {
    return this.contractFactory.convexDepositor({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x8014595f2ab54cd7c604b00e9fb932176fdc86ae' }];
  }

  async getTokenDefinitions(_params: GetTokenDefinitionsParams<ConvexDepositor>) {
    return [{ metaType: MetaType.SUPPLIED, address: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b' }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<ConvexDepositor>) {
    const depositToken = contractPosition.tokens[0]!;
    return `${getLabelFromToken(depositToken)} Depositor`;
  }

  async getTokenBalancesPerPosition() {
    return [0];
  }
}
