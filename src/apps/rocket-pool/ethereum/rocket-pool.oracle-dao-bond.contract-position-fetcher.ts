import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { RocketPoolViemContractFactory } from '../contracts';
import { RocketDaoNodeTrusted } from '../contracts/viem';

@PositionTemplate()
export class EthereumRocketPoolOracleDaoBondContractPositionFetcher extends ContractPositionTemplatePositionFetcher<RocketDaoNodeTrusted> {
  groupLabel = 'Oracle DAO Bond';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RocketPoolViemContractFactory) protected readonly contractFactory: RocketPoolViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.rocketDaoNodeTrusted({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0xb8e783882b11ff4f6cef3c501ea0f4b960152cc9' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: '0xd33526068d116ce69f19a9ee46f0bd304f21a51f',
        network: this.network,
      },
    ];
  }

  async getLabel() {
    return `Oracle DAO Bond`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<RocketDaoNodeTrusted>) {
    return [await contract.read.getMemberRPLBondAmount([address])];
  }
}
