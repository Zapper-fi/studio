import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { StakeDaoContractFactory, StakeDaoMultiGauge } from '../contracts';

@PositionTemplate()
export class EthereumStakeDaoMultiGaugeContractPositionFetcher extends ContractPositionTemplatePositionFetcher<StakeDaoMultiGauge> {
  groupLabel = 'Gauges';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StakeDaoContractFactory) protected readonly contractFactory: StakeDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StakeDaoMultiGauge {
    return this.contractFactory.stakeDaoMultiGauge({ address, network: this.network });
  }

  async getDefinitions() {
    return [
      {
        address: '0xeb81b86248d3c2b618ccb071adb122109da96da2', // Passive FRAX'
      },
    ];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<StakeDaoMultiGauge>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.stakingToken(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<StakeDaoMultiGauge>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<StakeDaoMultiGauge>) {
    const stakes = await contract.lockedStakesOf(address);
    const balanceRaw = stakes.map(x => x.liquidity);

    const sum = balanceRaw.reduce((sum, cur) => sum.add(cur), BigNumber.from(0));

    return [sum];
  }
}
