import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PlutusContractFactory, MasterChef } from '../contracts';
import { PLUTUS_DEFINITION } from '../plutus.definition';

import { VAULTS, ADDRESSES } from './consts';

const appId = PLUTUS_DEFINITION.id;
const groupId = PLUTUS_DEFINITION.groups.stake.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusStakeContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) private readonly contractFactory: PlutusContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<MasterChef>({
      appId,
      groupId,
      network,
      dependencies: [{ appId: 'sushiswap', groupIds: ['pool'], network }],
      resolveFarmAddresses: async () => [VAULTS.PLS_VAULT],
      resolveStakedTokenAddress: async ({ multicall, contract }) => {
        const pool = Number(await multicall.wrap(contract).poolLength()) - 1;
        return await multicall
          .wrap(contract)
          .poolInfo(pool)
          .then(info => info.lpToken);
      },
      resolveFarmContract: opts => this.contractFactory.masterChef(opts),
      resolveRewardTokenAddresses: async () => ADDRESSES.pls,
      resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
