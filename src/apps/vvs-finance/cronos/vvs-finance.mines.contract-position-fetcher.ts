import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import request, { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { VvsFinanceContractFactory } from '../contracts';
import { VVS_FINANCE_DEFINITION } from '../vvs-finance.definition';

const graphEndpoint = 'https://graph.cronoslabs.com/subgraphs/name/vvs/smartcraft';
const vvsSmartCraftsQuery = gql`
  query vvsSmartCrafts {
    smartCrafts {
      id
    }
  }
`;

interface VvsSmartCraftsQueryResult {
  smartCrafts: {
    id: string;
  }[];
}

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
    const { smartCrafts } = await request<VvsSmartCraftsQueryResult>(graphEndpoint, vvsSmartCraftsQuery);
    const mineAddrs = smartCrafts.map(({ id }) => id);

    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<null>({
      network,
      appId,
      groupId,
      address: '',
      resolveAddress: async ({ poolIndex }) => mineAddrs[poolIndex],
      dependencies: [{ appId, groupIds: [VVS_FINANCE_DEFINITION.groups.xvvs.id], network }],
      resolvePoolIndexIsValid: async ({ poolIndex, multicall }) => {
        const mineAddr = mineAddrs[poolIndex];

        const contract = this.contractFactory.vvsSmartCraftInitializable({ network, address: mineAddr });
        const factoryAddress = await multicall
          .wrap(contract)
          .SMART_CRAFT_FACTORY()
          .catch(() => null);
        return !!factoryAddress;
      },
      resolveContract: () => null,
      resolvePoolLength: async () => BigNumber.from(mineAddrs.length),
      resolveRewardTokenAddresses: ({ multicall, poolIndex }) => {
        const mineAddr = mineAddrs[poolIndex];

        const contract = this.contractFactory.vvsSmartCraftInitializable({ network, address: mineAddr });
        return multicall.wrap(contract).rewardToken();
      },
      resolveDepositTokenAddress: ({ multicall, poolIndex }) => {
        const mineAddr = mineAddrs[poolIndex];

        const contract = this.contractFactory.vvsSmartCraftInitializable({ network, address: mineAddr });
        return multicall.wrap(contract).stakedToken();
      },
      resolveEndBlock: async ({ multicall, poolIndex }) => {
        const mineAddr = mineAddrs[poolIndex];

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
          const mineAddr = mineAddrs[poolIndex];

          const contract = this.contractFactory.vvsSmartCraftInitializable({ network, address: mineAddr });
          return multicall.wrap(contract).rewardPerBlock();
        },
      }),
    });
  }
}
