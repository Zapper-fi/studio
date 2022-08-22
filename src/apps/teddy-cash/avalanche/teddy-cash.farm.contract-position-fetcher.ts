import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { GetTokenBalancesPerPositionParams } from '~position/template/contract-position.template.position-fetcher';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { TeddyCashContractFactory } from '../contracts';
import { TeddyCashStaking } from '../contracts/ethers/TeddyCashStaking';
import TEDDY_CASH_DEFINITION from '../teddy-cash.definition';

const FARMS = [
  {
    address: '0xb4387d93b5a9392f64963cd44389e7d9d2e1053c',
    stakedTokenAddress: '0x094bd7b2d99711a1486fb94d4395801c6d0fddcc',
    rewardTokenAddresses: ['0x4fbf0429599460d327bd5f55625e30e4fc066095', ZERO_ADDRESS], // TSD and AVAX
  },
];

const appId = TEDDY_CASH_DEFINITION.id;
const groupId = TEDDY_CASH_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheTeddyCashFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<TeddyCashStaking> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TeddyCashContractFactory) protected readonly contractFactory: TeddyCashContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TeddyCashStaking {
    return this.contractFactory.teddyCashStaking({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  async getRewardRates() {
    return [0, 0];
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesPerPositionParams<TeddyCashStaking>) {
    return contract.stakes(address);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesPerPositionParams<TeddyCashStaking>) {
    return Promise.all([contract.getPendingLUSDGain(address), contract.getPendingETHGain(address)]);
  }
}
