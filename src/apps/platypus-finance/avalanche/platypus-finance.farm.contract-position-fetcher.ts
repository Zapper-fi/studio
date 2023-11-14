import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { PlatypusFinanceViemContractFactory } from '../contracts';
import { PlatypusFinanceMasterPlatypusV1 } from '../contracts/viem';
import { PlatypusFinanceMasterPlatypusV1Contract } from '../contracts/viem/PlatypusFinanceMasterPlatypusV1';

@PositionTemplate()
export class AvalanchePlatypusFinanceFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PlatypusFinanceMasterPlatypusV1> {
  groupLabel = 'Farms';
  chefAddress = '0xb0523f9f473812fb195ee49bc7d2ab9873a98044';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlatypusFinanceViemContractFactory) protected readonly contractFactory: PlatypusFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.platypusFinanceMasterPlatypusV1({ address, network: this.network });
  }

  async getPoolLength(contract: PlatypusFinanceMasterPlatypusV1Contract) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: PlatypusFinanceMasterPlatypusV1Contract, poolIndex: number): Promise<string> {
    return (await contract.read.poolInfo([BigInt(poolIndex)]))[0];
  }

  async getRewardTokenAddress(contract: PlatypusFinanceMasterPlatypusV1Contract): Promise<string> {
    return contract.read.ptp();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<PlatypusFinanceMasterPlatypusV1>) {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<PlatypusFinanceMasterPlatypusV1>) {
    return contract.read.ptpPerSec();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<PlatypusFinanceMasterPlatypusV1>) {
    return (await contract.read.poolInfo([BigInt(definition.poolIndex)]))[1];
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PlatypusFinanceMasterPlatypusV1>) {
    return (await contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]))[0];
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PlatypusFinanceMasterPlatypusV1>) {
    return contract.read
      .pendingTokens([BigInt(contractPosition.dataProps.poolIndex), address])
      .then(v => v[0])
      .catch(err => {
        if (isViemMulticallUnderlyingError(err)) return 0;
        throw err;
      });
  }
}
