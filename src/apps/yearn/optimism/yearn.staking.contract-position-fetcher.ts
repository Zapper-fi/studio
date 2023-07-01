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

import { YearnContractFactory } from '../contracts';
import { YearnStaking } from '../contracts/ethers/YearnStaking';

@PositionTemplate()
export class OptimismYearnSakingContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<YearnStaking> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YearnContractFactory) protected readonly contractFactory: YearnContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): YearnStaking {
    return this.contractFactory.yearnStaking({ address, network: this.network });
  }

  async getFarmDefinitions({ multicall }: GetDefinitionsParams): Promise<SingleStakingFarmDefinition[]> {
    const stakingRewardRegistryContract = this.contractFactory.yearnStakingRewardRegistry({
      address: '0x8ed9f6343f057870f1def47aae7cd88dfaa049a8',
      network: this.network,
    });

    const numTokens = await multicall.wrap(stakingRewardRegistryContract).numTokens();

    const vaultTokenAddresses = await Promise.all(
      _.range(0, Number(numTokens)).map(async index => {
        return await multicall.wrap(stakingRewardRegistryContract).tokens(index);
      }),
    );

    const stakingPoolAddresses = await Promise.all(
      vaultTokenAddresses.map(async vaultTokenAddress => {
        const stakingPoolAddressesRaw = await multicall
          .wrap(stakingRewardRegistryContract)
          .stakingPool(vaultTokenAddress);
        return stakingPoolAddressesRaw.toLowerCase();
      }),
    );

    return await Promise.all(
      stakingPoolAddresses.map(async address => {
        const stakingPoolContract = this.contractFactory.yearnStaking({ address, network: this.network });
        const [stakedTokenAddress, rewardTokenAddresses] = await Promise.all([
          multicall.wrap(stakingPoolContract).stakingToken(),
          multicall.wrap(stakingPoolContract).rewardsToken(),
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
    return contract.rewardRate();
  }

  async getIsActive({ contract }: GetDataPropsParams<YearnStaking>) {
    return contract.rewardRate().then(rate => rate.gt(0));
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<YearnStaking>) {
    return contract.balanceOf(address);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<YearnStaking>) {
    return contract.earned(address);
  }
}
