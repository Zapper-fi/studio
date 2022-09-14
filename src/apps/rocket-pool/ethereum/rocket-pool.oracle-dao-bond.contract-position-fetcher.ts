import { Inject, Injectable } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { Network } from '~types/network.interface';

import { RocketDaoNodeTrusted, RocketPoolContractFactory } from '../contracts';
import { ROCKET_POOL_DEFINITION } from '../rocket-pool.definition';

@Injectable()
export class EthereumRocketPoolOracleDaoBondContractPositionFetcher extends ContractPositionTemplatePositionFetcher<RocketDaoNodeTrusted> {
  appId = ROCKET_POOL_DEFINITION.id;
  groupId = ROCKET_POOL_DEFINITION.groups.oracleDaoBond.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Oracle DAO Bond';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RocketPoolContractFactory) protected readonly contractFactory: RocketPoolContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): RocketDaoNodeTrusted {
    return this.contractFactory.rocketDaoNodeTrusted({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0xb8e783882b11ff4f6cef3c501ea0f4b960152cc9' }];
  }

  async getTokenDefinitions() {
    return [{ metaType: MetaType.SUPPLIED, address: '0xd33526068d116ce69f19a9ee46f0bd304f21a51f' }];
  }

  async getLabel() {
    return `Oracle DAO Bond`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<RocketDaoNodeTrusted>) {
    return [await contract.getMemberRPLBondAmount(address)];
  }
}
