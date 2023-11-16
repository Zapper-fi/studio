import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { SingleStakingFarmTemplateContractPositionFetcher } from '~position/template/single-staking.template.contract-position-fetcher';

import { DopexViemContractFactory } from '../contracts';
import { DopexDualRewardStaking } from '../contracts/viem';

const FARMS = [
  // rDPX v1
  {
    address: '0x8d481245801907b45823fb032e6848d0d3c29ae5',
    stakedTokenAddress: '0x32eb7902d4134bf98a28b963d26de779af92a212',
    rewardTokenAddresses: ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55', '0x32eb7902d4134bf98a28b963d26de779af92a212'],
  },
  // rDPX v2
  {
    address: '0x125cc7cce81a809c825c945e5aa874e60cccb6bb',
    stakedTokenAddress: '0x32eb7902d4134bf98a28b963d26de779af92a212',
    rewardTokenAddresses: ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55', '0x32eb7902d4134bf98a28b963d26de779af92a212'],
  },
];

@PositionTemplate()
export class ArbitrumDopexFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<DopexDualRewardStaking> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DopexViemContractFactory) protected readonly contractFactory: DopexViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.dopexDualRewardStaking({ address, network: this.network });
  }

  async getFarmDefinitions() {
    return FARMS;
  }

  getRewardRates({ contract }: GetDataPropsParams<DopexDualRewardStaking>) {
    return Promise.all([contract.read.rewardRateDPX(), contract.read.rewardRateRDPX()]);
  }

  getIsActive({ contract }: GetDataPropsParams<DopexDualRewardStaking>) {
    return Promise.all([contract.read.rewardRateDPX(), contract.read.rewardRateRDPX()]).then(([rateDPX, rateRDPX]) => {
      return rateDPX > 0 || rateRDPX > 0;
    });
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<DopexDualRewardStaking>) {
    return contract.read.balanceOf([address]);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<DopexDualRewardStaking>) {
    return contract.read.earned([address]).then(v => [v[0], v[1]]);
  }
}
