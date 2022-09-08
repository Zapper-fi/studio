import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
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

@Injectable()
export class EthereumPickleSingleRewardPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<PickleJarSingleRewardStaking> {
  appId = PICKLE_DEFINITION.id;
  groupId = PICKLE_DEFINITION.groups.singleStakingFarm.id;
  network = Network.ETHEREUM_MAINNET;
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
    const vaults = await this.jarCacheManager.getJarDefinitions({ network: this.network });
    const vaultsWithGauge = vaults.filter(v => v.gaugeAddress!);

    return vaultsWithGauge.map(({ vaultAddress, gaugeAddress }) => ({
      address: gaugeAddress!,
      stakedTokenAddress: vaultAddress,
      rewardTokenAddresses: ['0x429881672b9ae42b8eba0e26cd9c73711b891ca5'],
    }));
  }

  getRewardRates({ contract }: GetDataPropsParams<PickleJarSingleRewardStaking, SingleStakingFarmDataProps>) {
    return contract.rewardRate();
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<PickleJarSingleRewardStaking, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({
    address,
    contract,
  }: GetTokenBalancesParams<PickleJarSingleRewardStaking, SingleStakingFarmDataProps>) {
    return contract.earned(address);
  }
}
