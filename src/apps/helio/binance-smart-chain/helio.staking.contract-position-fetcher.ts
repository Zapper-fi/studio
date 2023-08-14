import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { HelioContractFactory, HelioJar } from '../contracts';

const FARMS = [
  {
    address: '0x0a1fd12f73432928c190caf0810b3b767a59717e',
    stakedTokenAddress: '0x0782b6d8c4551b9760e74c0545a9bcd90bdc41e5',
    rewardTokenAddresses: ['0x0782b6d8c4551b9760e74c0545a9bcd90bdc41e5'],
  },
];

@PositionTemplate()
export class BinanceSmartChainHelioStakingContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<HelioJar> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HelioContractFactory) protected readonly contractFactory: HelioContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): HelioJar {
    return this.contractFactory.helioJar({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  getRewardRates({ contract }: GetDataPropsParams<HelioJar, SingleStakingFarmDataProps>) {
    return contract.rate();
  }

  getIsActive({
    contract,
  }: GetDataPropsParams<HelioJar, SingleStakingFarmDataProps, SingleStakingFarmDefinition>): Promise<boolean> {
    return contract.rate().then(v => v.gt(0));
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<HelioJar, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<HelioJar, SingleStakingFarmDataProps>) {
    return contract.earned(address);
  }
}
