import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { WombatExchangeViemContractFactory } from '../contracts';
import { WombatExchangeMasterWombat } from '../contracts/viem';

@PositionTemplate()
export class BinanceSmartChainWombatExchangeFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<WombatExchangeMasterWombat> {
  groupLabel = 'Farms';
  chefAddress = '0xe2c07d20af0fb50cae6cdd615ca44abaaa31f9c8';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(WombatExchangeViemContractFactory) protected readonly contractFactory: WombatExchangeViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.wombatExchangeMasterWombat({ address, network: this.network });
  }

  async getPoolLength(contract: WombatExchangeMasterWombat) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: WombatExchangeMasterWombat, poolIndex: number): Promise<string> {
    return (await contract.read.poolInfo([poolIndex])).lpToken;
  }

  async getRewardTokenAddress(contract: WombatExchangeMasterWombat): Promise<string> {
    return contract.read.wom();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<WombatExchangeMasterWombat>) {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<WombatExchangeMasterWombat>) {
    return contract.read.womPerSec();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<WombatExchangeMasterWombat>) {
    return (await contract.read.poolInfo([BigInt(definition.poolIndex)])).allocPoint;
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<WombatExchangeMasterWombat>) {
    return (await contract.read.userInfo([contractPosition.dataProps.poolIndex, address])).amount;
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<WombatExchangeMasterWombat>) {
    return contract
      .pendingTokens(contractPosition.dataProps.poolIndex, address)
      .then(v => v.pendingRewards)
      .catch(err => {
        if (isViemMulticallUnderlyingError(err)) return 0;
        throw err;
      });
  }
}
