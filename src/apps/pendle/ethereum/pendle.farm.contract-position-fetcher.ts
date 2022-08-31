import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { Register } from '~app-toolkit/decorators';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { SingleStakingFarmTemplateContractPositionFetcher } from '~position/template/single-staking.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { PendleContractFactory, PendleStaking } from '../contracts';
import { PENDLE_DEFINITION } from '../pendle.definition';

const FARMS = [
  // PENDLE
  {
    address: '0x07282f2ceebd7a65451fcd268b364300d9e6d7f5',
    stakedTokenAddress: '0x808507121b80c02388fad14726482e061b8da827',
    rewardTokenAddresses: ['0x808507121b80c02388fad14726482e061b8da827'],
  },
];

const appId = PENDLE_DEFINITION.id;
const groupId = PENDLE_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumPendleFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<PendleStaking> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PendleContractFactory) protected readonly contractFactory: PendleContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PendleStaking {
    return this.contractFactory.pendleStaking({ address, network });
  }

  async getFarmDefinitions() {
    return FARMS;
  }

  async getRewardRates({ contract, multicall }: GetDataPropsParams<PendleStaking>) {
    const stakingManagerAddress = await contract.stakingManager();
    const stakingManager = this.contractFactory.pendleStakingManager({
      address: stakingManagerAddress,
      network: this.network,
    });

    const rewardRate = await multicall.wrap(stakingManager).rewardPerBlock();
    return new BigNumber(rewardRate.toString()).times(BLOCKS_PER_DAY[this.network] / 86_400).toString();
  }

  async getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<PendleStaking>) {
    return contract.balances(address);
  }

  async getRewardTokenBalances() {
    return 0;
  }
}
