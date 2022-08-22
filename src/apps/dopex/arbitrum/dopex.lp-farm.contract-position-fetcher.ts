import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  DataPropsStageParams,
  GetTokenBalancesPerPositionParams,
} from '~position/template/contract-position.template.position-fetcher';
import { SingleStakingFarmTemplateContractPositionFetcher } from '~position/template/single-staking.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { DopexContractFactory, DopexSingleRewardStaking } from '../contracts';
import { DOPEX_DEFINITION } from '../dopex.definition';

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

const appId = DOPEX_DEFINITION.id;
const groupId = DOPEX_DEFINITION.groups.lpFarm.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumDopexLpFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<DopexSingleRewardStaking> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'LP Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DopexContractFactory) protected readonly contractFactory: DopexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): DopexSingleRewardStaking {
    return this.contractFactory.dopexSingleRewardStaking({ address, network });
  }

  async getFarmDefinitions() {
    return FARMS;
  }

  getRewardRates({ contract }: DataPropsStageParams<DopexSingleRewardStaking>) {
    return contract.rewardRate();
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesPerPositionParams<DopexSingleRewardStaking>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesPerPositionParams<DopexSingleRewardStaking>) {
    return contract.earned(address);
  }
}
