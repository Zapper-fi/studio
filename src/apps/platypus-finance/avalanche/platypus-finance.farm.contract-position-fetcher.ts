import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { PlatypusFinanceContractFactory, PlatypusFinanceMasterPlatypusV1 } from '../contracts';

@PositionTemplate()
export class AvalanchePlatypusFinanceFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PlatypusFinanceMasterPlatypusV1> {
  groupLabel = 'Farms';
  chefAddresses = ['0xb0523f9f473812fb195ee49bc7d2ab9873a98044'];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlatypusFinanceContractFactory) protected readonly contractFactory: PlatypusFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PlatypusFinanceMasterPlatypusV1 {
    return this.contractFactory.platypusFinanceMasterPlatypusV1({ address, network: this.network });
  }

  async getPoolLength(contract: PlatypusFinanceMasterPlatypusV1) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: PlatypusFinanceMasterPlatypusV1, poolIndex: number): Promise<string> {
    return (await contract.poolInfo(poolIndex)).lpToken;
  }

  async getRewardTokenAddress(contract: PlatypusFinanceMasterPlatypusV1): Promise<string> {
    return contract.ptp();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<PlatypusFinanceMasterPlatypusV1>) {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<PlatypusFinanceMasterPlatypusV1>) {
    return contract.ptpPerSec();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<PlatypusFinanceMasterPlatypusV1>) {
    return (await contract.poolInfo(definition.poolIndex)).allocPoint;
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PlatypusFinanceMasterPlatypusV1>) {
    return (await contract.userInfo(contractPosition.dataProps.poolIndex, address)).amount;
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PlatypusFinanceMasterPlatypusV1>) {
    return contract
      .pendingTokens(contractPosition.dataProps.poolIndex, address)
      .then(v => v.pendingPtp)
      .catch(err => {
        if (isMulticallUnderlyingError(err)) return 0;
        throw err;
      });
  }
}
