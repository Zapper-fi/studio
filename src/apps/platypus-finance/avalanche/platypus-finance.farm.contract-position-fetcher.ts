import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { PlatypusFinanceContractFactory, PlatypusFinanceMasterPlatypusV1 } from '../contracts';
import { PLATYPUS_FINANCE_DEFINITION } from '../platypus-finance.definition';

const appId = PLATYPUS_FINANCE_DEFINITION.id;
const groupId = PLATYPUS_FINANCE_DEFINITION.groups.farm.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalanchePlatypusFinanceFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PlatypusFinanceMasterPlatypusV1> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Farms';
  chefAddress = '0xb0523f9f473812fb195ee49bc7d2ab9873a98044';

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
    return (await contract.pendingTokens(contractPosition.dataProps.poolIndex, address)).pendingPtp;
  }
}
