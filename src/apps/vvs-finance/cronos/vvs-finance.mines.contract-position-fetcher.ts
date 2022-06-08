import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { VvsFinanceContractFactory } from '../contracts';
import { VVS_FINANCE_DEFINITION } from '../vvs-finance.definition';

const MINES = [
  '0x87fd1bdee5dd3f93ec78adf1743eb804d796aa79',
  '0xe3d0b112df42b525501d9312f81d80dff21f89c8',
  '0x7bc5d594531759f8989eb1a0f8302174ce0503b4',
  '0xc89bf1eeef0ba6417485dfa6b7b732113155fc96',
  '0x0b8d4cc66fecee7cbf687b438bcc97fa40716ecb',
  '0xf7514c62582937ed661ac008d2eaefeca12daf16',
  '0xa618d96d36cb32a7618e71850bd569726608372e',
  '0x2d676d626d812a38eee2addbf8b22416c0313efb',
  '0xa3b4d4a5b287e8ec105f49246c642face481df55',
  '0xc01d557a3a0408de13d0a204cdb30277de1c8255',
  '0xcf50995e41d3cda83e0997b5daaeb2bd73300bf2',
  '0xe94d70f670d82b250f477d461059201570531ce3',
  '0xa46c0382654248509a1ed888cccba964693dedcb',
  '0xf0b9b4fbd1d6b6b9b9fa13736fe12bd2414bc677',
  '0x1a888d7b2abfd2b5046d8461e6d1703f654a8fc0',
  '0xa9e36deee3b457ae50cd1776f205c1d389e6d16b',
];

const appId = VVS_FINANCE_DEFINITION.id;
const groupId = VVS_FINANCE_DEFINITION.groups.mine.id;
const network = Network.CRONOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CronosVvsFinanceMinesContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VvsFinanceContractFactory) private readonly contractFactory: VvsFinanceContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<null>({
      network,
      appId,
      groupId,
      address: '',
      resolveAddress: async ({ poolIndex }) => MINES[poolIndex],
      dependencies: [{ appId, groupIds: [VVS_FINANCE_DEFINITION.groups.xvvs.id], network }],
      resolvePoolIndexIsValid: async ({ poolIndex, multicall }) => {
        const mineAddr = MINES[poolIndex];

        const contract = this.contractFactory.vvsSmartCraftInitializable({ network, address: mineAddr });
        const factoryAddress = await multicall
          .wrap(contract)
          .SMART_CRAFT_FACTORY()
          .catch(() => null);
        return !!factoryAddress;
      },
      resolveContract: () => null,
      resolvePoolLength: async () => BigNumber.from(MINES.length),
      resolveRewardTokenAddresses: ({ multicall, poolIndex }) => {
        const mineAddr = MINES[poolIndex];

        const contract = this.contractFactory.vvsSmartCraftInitializable({ network, address: mineAddr });
        return multicall.wrap(contract).rewardToken();
      },
      resolveDepositTokenAddress: ({ multicall, poolIndex }) => {
        const mineAddr = MINES[poolIndex];

        const contract = this.contractFactory.vvsSmartCraftInitializable({ network, address: mineAddr });
        return multicall.wrap(contract).stakedToken();
      },
      resolveEndBlock: async ({ multicall, poolIndex }) => {
        const mineAddr = MINES[poolIndex];

        const contract = this.contractFactory.vvsSmartCraftInitializable({ network, address: mineAddr });
        return multicall
          .wrap(contract)
          .bonusEndBlock()
          .then(v => v.toNumber());
      },
      rewardRateUnit: RewardRateUnit.BLOCK,
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: () => '1',
        resolveTotalAllocPoints: () => '1',
        resolveTotalRewardRate: ({ multicall, poolIndex }) => {
          const mineAddr = MINES[poolIndex];

          const contract = this.contractFactory.vvsSmartCraftInitializable({ network, address: mineAddr });
          return multicall.wrap(contract).rewardPerBlock();
        },
      }),
    });
  }
}
