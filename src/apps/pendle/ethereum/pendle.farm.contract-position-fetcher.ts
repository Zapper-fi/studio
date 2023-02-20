import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { SingleStakingFarmTemplateContractPositionFetcher } from '~position/template/single-staking.template.contract-position-fetcher';

import { PendleContractFactory, PendleStaking } from '../contracts';

const FARMS = [
  // PENDLE
  {
    address: '0x07282f2ceebd7a65451fcd268b364300d9e6d7f5',
    stakedTokenAddress: '0x808507121b80c02388fad14726482e061b8da827',
    rewardTokenAddresses: ['0x808507121b80c02388fad14726482e061b8da827'],
  },
];

@PositionTemplate()
export class EthereumPendleFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<PendleStaking> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PendleContractFactory) protected readonly contractFactory: PendleContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PendleStaking {
    return this.contractFactory.pendleStaking({ address, network: this.network });
  }

  async getFarmDefinitions() {
    return FARMS;
  }

  async getRewardRates({ contract, multicall }: GetDataPropsParams<PendleStaking>) {
    const stakingManagerAddress = await contract.stakingManager();
    const stakingManager = this.contractFactory.pendleStakingManager({
      address: stakingManagerAddress,
      network: this.network,
    });

    const rewardRate = await multicall.wrap(stakingManager).rewardPerBlock();
    return new BigNumber(rewardRate.toString()).times(BLOCKS_PER_DAY[this.network] / 86_400).toString();
  }

  async getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<PendleStaking>) {
    return contract.balances(address);
  }

  async getRewardTokenBalances() {
    return 0;
  }
}
