import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  DataPropsStageParams,
  GetTokenBalancesPerPositionParams,
} from '~position/template/contract-position.template.position-fetcher';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { HectorNetworkContractFactory } from '../contracts';
import { HectorNetworkStakingRewards } from '../contracts/ethers/HectorNetworkStakingRewards';
import { HECTOR_NETWORK_DEFINITION } from '../hector-network.definition';

// NOTE: Hector Network also has two other pools staked in the SpookySwap MasterChef
const FARMS = [
  {
    address: '0x61b71689684800f73ebb67378fc2e1527fbdc3b3',
    stakedTokenAddress: '0x24699312cb27c26cfc669459d670559e5e44ee60',
    rewardTokenAddresses: ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'],
  },
];

const appId = HECTOR_NETWORK_DEFINITION.id;
const groupId = HECTOR_NETWORK_DEFINITION.groups.farm.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class FantomHectorNetworkFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<HectorNetworkStakingRewards> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HectorNetworkContractFactory) protected readonly contractFactory: HectorNetworkContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): HectorNetworkStakingRewards {
    return this.contractFactory.hectorNetworkStakingRewards({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  getRewardRates({ contract }: DataPropsStageParams<HectorNetworkStakingRewards>) {
    return contract.rewardRate();
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesPerPositionParams<HectorNetworkStakingRewards>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesPerPositionParams<HectorNetworkStakingRewards>) {
    return contract.earned(address);
  }
}
