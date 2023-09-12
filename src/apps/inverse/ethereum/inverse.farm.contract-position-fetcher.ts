import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { SynthetixContractFactory, SynthetixRewards } from '~apps/synthetix/contracts';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

const FARMS = [
  // DOLA 3CRV Curve
  {
    address: '0xa88948217f21175337226d94f1a47b7a01eed197',
    stakedTokenAddress: '0x9547429c0e2c3a8b88c6833b58fce962734c0e8c',
    rewardTokenAddresses: ['0x41d5d79431a913c4ae7d69a668ecdfe5ff9dfb68'],
  },
];

@PositionTemplate()
export class EthereumInverseFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<SynthetixRewards> {
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) protected readonly contractFactory: SynthetixContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SynthetixRewards {
    return this.contractFactory.synthetixRewards({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  async getRewardRates({ contract }: GetDataPropsParams<SynthetixRewards>) {
    return contract.rewardRate();
  }

  async getIsActive({ contract }: GetDataPropsParams<SynthetixRewards>): Promise<boolean> {
    return (await contract.rewardRate()).gt(0);
  }

  async getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<SynthetixRewards>) {
    return contract.balanceOf(address);
  }

  async getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<SynthetixRewards>) {
    return contract.earned(address);
  }
}
