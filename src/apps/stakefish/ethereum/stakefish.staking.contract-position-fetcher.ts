import { Inject } from '@nestjs/common';
import axios from 'axios';
import { sumBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { StakefishFeePool, StakefishContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumStakefishStakingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<StakefishFeePool> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StakefishContractFactory) protected readonly contractFactory: StakefishContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StakefishFeePool {
    return this.contractFactory.stakefishFeePool({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x54cd0e6771b6487c721ec620c4de1240d3b07696' }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<StakefishFeePool>) {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenDefinitions() {
    return [
      { metaType: MetaType.SUPPLIED, address: ZERO_ADDRESS },
      { metaType: MetaType.VESTING, address: ZERO_ADDRESS },
      { metaType: MetaType.CLAIMABLE, address: ZERO_ADDRESS },
    ];
  }

  async getStakedBalances(address: string, isStaked: number) {
    if (!isStaked) return [0, 0];
    const response = await axios.get(
      `https://fee-pool-api-mainnet.oracle.ethereum.fish/validators?depositor=${address}`,
    );
    const staked = sumBy(response.data.results, 'effective_balance');
    const total = sumBy(response.data.results, 'balance');
    return [staked, total].map(x => Number(x) * 1e9);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<StakefishFeePool>) {
    const [pending, claimed] = await contract.pendingReward(address);
    const [staked, total] = await this.getStakedBalances(address, Number(pending) + Number(claimed));
    return [staked, total - staked, pending];
  }
}
