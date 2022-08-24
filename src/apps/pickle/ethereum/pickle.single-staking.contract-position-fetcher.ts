import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  DataPropsStageParams,
  GetTokenBalancesPerPositionParams,
} from '~position/template/contract-position.template.position-fetcher';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { PickleApiJarRegistry } from '../common/pickle.api.jar-registry';
import { PickleContractFactory } from '../contracts';
import { PickleJarSingleRewardStaking } from '../contracts/ethers/PickleJarSingleRewardStaking';
import { PICKLE_DEFINITION } from '../pickle.definition';

const appId = PICKLE_DEFINITION.id;
const groupId = PICKLE_DEFINITION.groups.singleStakingFarm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumPickleSingleRewardPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<PickleJarSingleRewardStaking> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PickleContractFactory) protected readonly contractFactory: PickleContractFactory,
    @Inject(PickleApiJarRegistry) protected readonly jarCacheManager: PickleApiJarRegistry,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PickleJarSingleRewardStaking {
    return this.contractFactory.pickleJarSingleRewardStaking({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    const vaults = await this.jarCacheManager.getJarDefinitions({ network });
    const vaultsWithGauge = vaults.filter(v => v.gaugeAddress!);

    return vaultsWithGauge.map(({ vaultAddress, gaugeAddress }) => ({
      address: gaugeAddress!,
      stakedTokenAddress: vaultAddress,
      rewardTokenAddresses: ['0x429881672b9ae42b8eba0e26cd9c73711b891ca5'],
    }));
  }

  getRewardRates({ contract }: DataPropsStageParams<PickleJarSingleRewardStaking, SingleStakingFarmDataProps>) {
    return contract.rewardRate();
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesPerPositionParams<PickleJarSingleRewardStaking, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({
    address,
    contract,
  }: GetTokenBalancesPerPositionParams<PickleJarSingleRewardStaking, SingleStakingFarmDataProps>) {
    return contract.earned(address);
  }
}
