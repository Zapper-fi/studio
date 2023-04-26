import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { ShapeshiftContractFactory, ShapeshiftStakingRewards } from '../contracts';

const FARMS = [
  // UNI-V2 FOX / ETH v1 (inactive)
  {
    address: '0xdd80e21669a664bce83e3ad9a0d74f8dad5d9e72',
    stakedTokenAddress: '0x470e8de2ebaef52014a47cb5e6af86884947f08c',
    rewardTokenAddresses: ['0xc770eefad204b5180df6a14ee197d99d808ee52d'],
  },
  // UNI-V2 FOX / ETH v2 (inactive)
  {
    address: '0xc54b9f82c1c54e9d4d274d633c7523f2299c42a0',
    stakedTokenAddress: '0x470e8de2ebaef52014a47cb5e6af86884947f08c',
    rewardTokenAddresses: ['0xc770eefad204b5180df6a14ee197d99d808ee52d'],
  },
  // UNI-V2 FOX / ETH v3 (inactive)
  {
    address: '0x212ebf9fd3c10f371557b08e993eaab385c3932b',
    stakedTokenAddress: '0x470e8de2ebaef52014a47cb5e6af86884947f08c',
    rewardTokenAddresses: ['0xc770eefad204b5180df6a14ee197d99d808ee52d'],
  },
  // UNI-V2 FOX / ETH v4 (inactive)
  {
    address: '0x24fd7fb95dc742e23dc3829d3e656feeb5f67fa0',
    stakedTokenAddress: '0x470e8de2ebaef52014a47cb5e6af86884947f08c',
    rewardTokenAddresses: ['0xc770eefad204b5180df6a14ee197d99d808ee52d'],
  },
  // UNI-V2 FOX / ETH v5 (inactive)
  {
    address: '0xc14eaa8284feff79edc118e06cadbf3813a7e555',
    stakedTokenAddress: '0x470e8de2ebaef52014a47cb5e6af86884947f08c',
    rewardTokenAddresses: ['0xc770eefad204b5180df6a14ee197d99d808ee52d'],
  },
  // UNI-V2 FOX / ETH v6 (active)
  {
    address: '0xebb1761ad43034fd7faa64d84e5bbd8cb5c40b68',
    stakedTokenAddress: '0x470e8de2ebaef52014a47cb5e6af86884947f08c',
    rewardTokenAddresses: ['0xc770eefad204b5180df6a14ee197d99d808ee52d'],
  },
];

@PositionTemplate()
export class EthereumShapeshiftFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<ShapeshiftStakingRewards> {
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ShapeshiftContractFactory) protected readonly contractFactory: ShapeshiftContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ShapeshiftStakingRewards {
    return this.contractFactory.shapeshiftStakingRewards({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  async getRewardRates({ contract }: GetDataPropsParams<ShapeshiftStakingRewards>) {
    return contract.rewardRate();
  }

  async getIsActive({ contract }: GetDataPropsParams<ShapeshiftStakingRewards>) {
    return (await contract.periodFinish()).gt(Math.floor(Date.now() / 1000));
  }

  async getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<ShapeshiftStakingRewards>) {
    return contract.balanceOf(address);
  }

  async getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<ShapeshiftStakingRewards>) {
    return contract.earned(address);
  }
}
