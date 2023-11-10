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

  async getPoolLength(contract: PlatypusFinanceMasterPlatypusV2) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: PlatypusFinanceMasterPlatypusV2, poolIndex: number): Promise<string> {
    return (await contract.read.poolInfo([poolIndex])).lpToken;
  }

  async getRewardTokenAddress(contract: PlatypusFinanceMasterPlatypusV2): Promise<string> {
    return contract.read.ptp();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<PlatypusFinanceMasterPlatypusV2>) {
    return contract.read.totalAdjustedAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<PlatypusFinanceMasterPlatypusV2>) {
    return contract.read.ptpPerSec();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<PlatypusFinanceMasterPlatypusV2>) {
    return (await contract.read.poolInfo([BigInt(definition.poolIndex)])).adjustedAllocPoint;
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PlatypusFinanceMasterPlatypusV2>) {
    return (await contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address])).amount;
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PlatypusFinanceMasterPlatypusV2>) {
    return contract
      .pendingTokens(contractPosition.dataProps.poolIndex, address)
      .then(v => v.pendingPtp)
      .catch(err => {
        if (isViemMulticallUnderlyingError(err)) return 0;
        throw err;
      });
  }
}
