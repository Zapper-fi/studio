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
import { PlatypusFinanceMasterPlatypusV2 } from '../contracts/viem';
import { PlatypusFinanceMasterPlatypusV2Contract } from '../contracts/viem/PlatypusFinanceMasterPlatypusV2';

@PositionTemplate()
export class AvalanchePlatypusFinanceChefContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PlatypusFinanceMasterPlatypusV2> {
  groupLabel = 'Farms';
  chefAddress = '0x68c5f4374228beedfa078e77b5ed93c28a2f713e';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlatypusFinanceViemContractFactory) protected readonly contractFactory: PlatypusFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.platypusFinanceMasterPlatypusV2({ address, network: this.network });
  }

  async getPoolLength(contract: PlatypusFinanceMasterPlatypusV2Contract) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: PlatypusFinanceMasterPlatypusV2Contract, poolIndex: number): Promise<string> {
    return (await contract.read.poolInfo([BigInt(poolIndex)]))[0];
  }

  async getRewardTokenAddress(contract: PlatypusFinanceMasterPlatypusV2Contract): Promise<string> {
    return contract.read.ptp();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<PlatypusFinanceMasterPlatypusV2>) {
    return contract.read.totalAdjustedAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<PlatypusFinanceMasterPlatypusV2>) {
    return contract.read.ptpPerSec();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<PlatypusFinanceMasterPlatypusV2>) {
    return (await contract.read.poolInfo([BigInt(definition.poolIndex)]))[7];
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PlatypusFinanceMasterPlatypusV2>) {
    return (await contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]))[0];
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PlatypusFinanceMasterPlatypusV2>) {
    return contract.read
      .pendingTokens([BigInt(contractPosition.dataProps.poolIndex), address])
      .then(v => v[0])
      .catch(err => {
        if (isViemMulticallUnderlyingError(err)) return 0;
        throw err;
      });
  }
}
