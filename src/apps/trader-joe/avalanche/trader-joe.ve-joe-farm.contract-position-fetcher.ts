import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { TraderJoeVeJoeStaking, TraderJoeContractFactory } from '../contracts';

@PositionTemplate()
export class AvalancheTraderJoeVeJoeContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<TraderJoeVeJoeStaking> {
  groupLabel = 'veJOE';
  chefAddresses = ['0x25d85e17dd9e544f6e9f8d44f99602dbf5a97341'];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TraderJoeContractFactory) protected readonly contractFactory: TraderJoeContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TraderJoeVeJoeStaking {
    return this.contractFactory.traderJoeVeJoeStaking({ address, network: this.network });
  }

  async getPoolLength(_contract: TraderJoeVeJoeStaking): Promise<BigNumberish> {
    return 1;
  }

  async getStakedTokenAddress(contract: TraderJoeVeJoeStaking) {
    return contract.joe();
  }

  async getRewardTokenAddress(contract: TraderJoeVeJoeStaking) {
    return contract.veJoe();
  }

  async getTotalAllocPoints(_params: GetMasterChefDataPropsParams<TraderJoeVeJoeStaking>) {
    return 1;
  }

  async getPoolAllocPoints(_params: GetMasterChefDataPropsParams<TraderJoeVeJoeStaking>) {
    return 1;
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<TraderJoeVeJoeStaking>) {
    return contract.veJoePerSharePerSec();
  }

  async getStakedTokenBalance({ address, contract }: GetMasterChefTokenBalancesParams<TraderJoeVeJoeStaking>) {
    return contract.userInfos(address).then(v => v.balance);
  }

  async getRewardTokenBalance({ address, contract }: GetMasterChefTokenBalancesParams<TraderJoeVeJoeStaking>) {
    return contract.getPendingVeJoe(address);
  }
}
