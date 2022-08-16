// import { Inject } from '@nestjs/common';

// import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
// import { Register } from '~app-toolkit/decorators';
// import { TRADER_JOE_DEFINITION } from '~apps/trader-joe/trader-joe.definition';
// import { PositionFetcher } from '~position/position-fetcher.interface';
// import { ContractPosition } from '~position/position.interface';
// import { Network } from '~types/network.interface';

// import { SteakHutContractFactory, SteakHutPool } from '../contracts';
// import { STEAK_HUT_DEFINITION } from '../steak-hut.definition';

// const appId = STEAK_HUT_DEFINITION.id;
// const groupId = STEAK_HUT_DEFINITION.groups.pool.id;
// const network = Network.AVALANCHE_MAINNET;

// @Register.ContractPositionFetcher({ appId, groupId, network })
// export class AvalancheSteakHutPoolContractPositionFetcher implements PositionFetcher<ContractPosition> {
//   constructor(
//     @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
//     @Inject(SteakHutContractFactory) private readonly contractFactory: SteakHutContractFactory,
//   ) {}

//   async getPositions() {
//     return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<SteakHutPool>({
//       address: '0xddbfbd5dc3ba0feb96cb513b689966b2176d4c09'.toLowerCase(),
//       appId,
//       groupId,
//       network,
//       dependencies: [{ appId: TRADER_JOE_DEFINITION.id, groupIds: [TRADER_JOE_DEFINITION.groups.pool.id], network }],
//       resolveContract: ({ address, network }) => this.contractFactory.steakHutPool({ address, network }),
//       resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
//       resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
//         multicall
//           .wrap(contract)
//           .poolInfo(poolIndex)
//           .then(v => v.lpToken),
//       resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).JOE(),
//     });
//   }
// }

import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { MasterChefTemplateContractPositionFetcher } from '~position/template/master-chef.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { SteakHutPool, SteakHutContractFactory } from '../contracts';
import STEAK_HUT_DEFINITION from '../steak-hut.definition';

const appId = STEAK_HUT_DEFINITION.id;
const groupId = STEAK_HUT_DEFINITION.groups.pool.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheSteakHutPoolContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<SteakHutPool> {
  appId = appId;
  groupId = groupId;
  network = network;
  chefAddress = '0xddbfbd5dc3ba0feb96cb513b689966b2176d4c09';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SteakHutContractFactory) protected readonly contractFactory: SteakHutContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SteakHutPool {
    return this.contractFactory.steakHutPool({ address, network: this.network });
  }

  async getPoolLength(contract: SteakHutPool): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: SteakHutPool, poolIndex: number): Promise<string> {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: SteakHutPool): Promise<string> {
    return contract.JOE();
  }

  async getTotalAllocPoints(_contract: SteakHutPool): Promise<BigNumberish> {
    return 1;
  }

  async getTotalRewardRate(_contract: SteakHutPool): Promise<BigNumberish> {
    return 0;
  }

  async getPoolAllocPoints(_contract: SteakHutPool, _poolIndex: number): Promise<BigNumberish> {
    return 0;
  }

  async getStakedTokenBalance(address: string, contract: SteakHutPool, poolIndex: number): Promise<BigNumberish> {
    return contract.userInfo(poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance(address: string, contract: SteakHutPool, poolIndex: number): Promise<BigNumberish> {
    return contract.pendingJoe(poolIndex, address);
  }
}
