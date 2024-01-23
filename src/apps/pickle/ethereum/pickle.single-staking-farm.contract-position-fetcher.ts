import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { PickleApiJarRegistry } from '../common/pickle.api.jar-registry';
import { PickleViemContractFactory } from '../contracts';
import { PickleJarSingleRewardStaking } from '../contracts/viem/PickleJarSingleRewardStaking';

@PositionTemplate()
export class EthereumPickleSingleRewardPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<PickleJarSingleRewardStaking> {
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PickleViemContractFactory) protected readonly contractFactory: PickleViemContractFactory,
    @Inject(PickleApiJarRegistry) protected readonly jarCacheManager: PickleApiJarRegistry,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pickleJarSingleRewardStaking({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    const vaults = await this.jarCacheManager.getJarDefinitions(this.network);
    const vaultsWithGauge = vaults.filter(v => v.gaugeAddress!);

    return vaultsWithGauge.map(({ jarAddress, gaugeAddress }) => ({
      address: gaugeAddress!,
      stakedTokenAddress: jarAddress,
      rewardTokenAddresses: ['0x429881672b9ae42b8eba0e26cd9c73711b891ca5'],
    }));
  }

  getRewardRates({ contract }: GetDataPropsParams<PickleJarSingleRewardStaking, SingleStakingFarmDataProps>) {
    return contract.read.rewardRate();
  }

  async getIsActive({ contract }: GetDataPropsParams<PickleJarSingleRewardStaking>) {
    return (await contract.read.rewardRate()) > 0;
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<PickleJarSingleRewardStaking, SingleStakingFarmDataProps>) {
    return contract.read.balanceOf([address]);
  }

  getRewardTokenBalances({
    address,
    contract,
  }: GetTokenBalancesParams<PickleJarSingleRewardStaking, SingleStakingFarmDataProps>) {
    return contract.read.earned([address]);
  }
}
