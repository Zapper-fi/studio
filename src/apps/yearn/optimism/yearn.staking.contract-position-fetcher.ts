import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetDataPropsParams,
  GetDefinitionsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { YearnViemContractFactory } from '../contracts';
import { YearnStaking } from '../contracts/viem/YearnStaking';

@PositionTemplate()
export class OptimismYearnSakingContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<YearnStaking> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YearnViemContractFactory) protected readonly contractFactory: YearnViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.yearnStaking({ address, network: this.network });
  }

  async getFarmDefinitions({ multicall }: GetDefinitionsParams): Promise<SingleStakingFarmDefinition[]> {
    const stakingRewardRegistryContract = this.contractFactory.yearnStakingRewardRegistry({
      address: '0x8ed9f6343f057870f1def47aae7cd88dfaa049a8',
      network: this.network,
    });

    const numTokens = await multicall.wrap(stakingRewardRegistryContract).read.numTokens();

    const vaultTokenAddresses = await Promise.all(
      _.range(0, Number(numTokens)).map(async index => {
        return await multicall.wrap(stakingRewardRegistryContract).read.tokens([BigInt(index)]);
      }),
    );

    const stakingPoolAddresses = await Promise.all(
      vaultTokenAddresses.map(async vaultTokenAddress => {
        const stakingPoolAddressesRaw = await multicall
          .wrap(stakingRewardRegistryContract)
          .read.stakingPool([vaultTokenAddress]);
        return stakingPoolAddressesRaw.toLowerCase();
      }),
    );

    return await Promise.all(
      stakingPoolAddresses.map(async address => {
        const stakingPoolContract = this.contractFactory.yearnStaking({ address, network: this.network });
        const [stakedTokenAddress, rewardTokenAddresses] = await Promise.all([
          multicall.wrap(stakingPoolContract).read.stakingToken(),
          multicall.wrap(stakingPoolContract).read.rewardsToken(),
        ]);

        return {
          address,
          stakedTokenAddress: stakedTokenAddress.toLowerCase(),
          rewardTokenAddresses: [rewardTokenAddresses.toLowerCase()],
        };
      }),
    );
  }

  async getRewardRates({ contract }: GetDataPropsParams<YearnStaking>) {
    return contract.read.rewardRate();
  }

  async getIsActive({ contract }: GetDataPropsParams<YearnStaking>) {
    return contract.read.rewardRate().then(rate => rate > 0);
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<YearnStaking>) {
    return contract.read.balanceOf([address]);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<YearnStaking>) {
    return contract.read.earned([address]);
  }
}
