import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { SingleStakingFarmTemplateContractPositionFetcher } from '~position/template/single-staking.template.contract-position-fetcher';

import { DopexContractFactory, DopexSingleRewardStaking } from '../contracts';

const FARMS = [
  // SUSHI DPX/WETH
  {
    address: '0x1f80c96ca521d7247a818a09b0b15c38e3e58a28',
    stakedTokenAddress: '0x0c1cf6883efa1b496b01f654e247b9b419873054',
    rewardTokenAddresses: ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55'],
  },
  // SUSHI rDPX/WETH
  {
    address: '0xeb0f03a203f25f08c7aff0e1b1c2e0ee25ca29eb',
    stakedTokenAddress: '0x7418f5a2621e13c05d1efbd71ec922070794b90a',
    rewardTokenAddresses: ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55'],
  },
];

@PositionTemplate()
export class ArbitrumDopexLpFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<DopexSingleRewardStaking> {
  groupLabel = 'LP Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DopexContractFactory) protected readonly contractFactory: DopexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): DopexSingleRewardStaking {
    return this.contractFactory.dopexSingleRewardStaking({ address, network: this.network });
  }

  async getFarmDefinitions() {
    return FARMS;
  }

  getRewardRates({ contract }: GetDataPropsParams<DopexSingleRewardStaking>) {
    return contract.rewardRate();
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<DopexSingleRewardStaking>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<DopexSingleRewardStaking>) {
    return contract.earned(address);
  }
}
