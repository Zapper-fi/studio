import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { IlluviumContractFactory, IlluviumSushiLpPoolV2, IlluviumIlvPoolV2 } from '../contracts';
import { ILLUVIUM_DEFINITION } from '../illuvium.definition';

const appId = ILLUVIUM_DEFINITION.id;
const groupId = ILLUVIUM_DEFINITION.groups.farmV2.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumIlluviumFarmV2ContractPositionFetcher implements PositionFetcher<ContractPosition> {
  private readonly ILV_STAKING_ADDRESS = '0x7f5f854ffb6b7701540a00c69c4ab2de2b34291d';
  private readonly SLP_ILV_ETH_STAKING_ADDRESS = '0xe98477bdc16126bb0877c6e3882e3edd72571cc2';

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(IlluviumContractFactory) private readonly contractFactory: IlluviumContractFactory,
  ) {}

  async getPositions() {
    return Promise.all([
      // ILV staking
      this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<IlluviumIlvPoolV2>({
        appId,
        groupId,
        network,
        resolveFarmAddresses: () => [this.ILV_STAKING_ADDRESS],
        resolveFarmContract: ({ address, network }) => this.contractFactory.illuviumIlvPoolV2({ address, network }),
        resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).poolToken(),
        resolveRewardTokenAddresses: async () => {
          const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
          const ilvToken = baseTokens.find(p => p.symbol === 'ILV')!;
          return [ilvToken.address];
        },
        resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
      }),
      // ILV/ETH staking
      this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<IlluviumSushiLpPoolV2>({
        appId,
        groupId,
        network,
        dependencies: [{ appId: 'sushiswap', groupIds: ['pool'], network }],
        resolveFarmAddresses: () => [this.SLP_ILV_ETH_STAKING_ADDRESS],
        resolveFarmContract: ({ address, network }) => this.contractFactory.illuviumSushiLpPoolV2({ address, network }),
        resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).poolToken(),
        resolveRewardTokenAddresses: async () => {
          const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
          const ilvToken = baseTokens.find(p => p.symbol === 'ILV')!;
          return [ilvToken.address];
        },
        resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
      }),
    ]).then(v => v.flat());
  }
}
