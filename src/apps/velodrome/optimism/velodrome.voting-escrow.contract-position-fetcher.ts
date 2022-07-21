import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { VelodromeContractFactory, VelodromeVe } from '../contracts';
import { VELODROME_DEFINITION } from '../velodrome.definition';

const appId = VELODROME_DEFINITION.id;
const groupId = VELODROME_DEFINITION.groups.votingEscrow.id;
const network = Network.OPTIMISM_MAINNET;
const address = '0x9c7305eb78a432ced5c4d14cac27e8ed569a2e26'.toLowerCase();

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismVelodromeVotingEscrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VelodromeContractFactory) private readonly contractFactory: VelodromeContractFactory,
  ) {}

  async getPositions() {
    const position =
      await this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<VelodromeVe>({
        appId,
        groupId,
        network,
        resolveFarmAddresses: () => [address],
        resolveFarmContract: address => this.contractFactory.velodromeVe(address),
        resolveStakedTokenAddress: async ({ multicall, contract }) =>
          (await multicall.wrap(contract).token()).toLowerCase(),
        resolveRois: () => ({
          dailyROI: 0,
          weeklyROI: 0,
          yearlyROI: 0,
        }),
      });
    return position;
  }
}
