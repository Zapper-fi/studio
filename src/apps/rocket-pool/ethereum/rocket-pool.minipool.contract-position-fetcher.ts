import { Inject, Injectable } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { Network } from '~types/network.interface';

import { RocketMinipoolManager, RocketPoolContractFactory } from '../contracts';
import { ROCKET_POOL_DEFINITION } from '../rocket-pool.definition';

@Injectable()
export class EthereumRocketPoolMinipoolContractPositionFetcher extends ContractPositionTemplatePositionFetcher<RocketMinipoolManager> {
  appId = ROCKET_POOL_DEFINITION.id;
  groupId = ROCKET_POOL_DEFINITION.groups.minipool.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Minipools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RocketPoolContractFactory) protected readonly contractFactory: RocketPoolContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): RocketMinipoolManager {
    return this.contractFactory.rocketMinipoolManager({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x6293b8abc1f36afb22406be5f96d893072a8cf3a' }];
  }

  async getTokenDefinitions() {
    return [{ metaType: MetaType.SUPPLIED, address: ZERO_ADDRESS }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<RocketMinipoolManager>) {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<RocketMinipoolManager>) {
    const minipoolCount = (await contract.getNodeActiveMinipoolCount(address)).toNumber();
    const minipoolDepositSize = 16 * 10 ** 18; // 16 ETH
    const balanceRaw = minipoolCount * minipoolDepositSize;
    return [balanceRaw.toString()];
  }
}
