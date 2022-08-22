import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  DataPropsStageParams,
  GetTokenBalancesPerPositionParams,
} from '~position/template/contract-position.template.position-fetcher';
import { SingleStakingFarmTemplateContractPositionFetcher } from '~position/template/single-staking.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { DopexContractFactory, DopexDualRewardStaking } from '../contracts';
import { DOPEX_DEFINITION } from '../dopex.definition';

const FARMS = [
  // rDPX v1
  {
    address: '0x8d481245801907b45823fb032e6848d0d3c29ae5',
    stakedTokenAddress: '0x32eb7902d4134bf98a28b963d26de779af92a212',
    rewardTokenAddresses: ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55', '0x32eb7902d4134bf98a28b963d26de779af92a212'],
  },
  // rDPX v2
  {
    address: '0x125cc7cce81a809c825c945e5aa874e60cccb6bb',
    stakedTokenAddress: '0x32eb7902d4134bf98a28b963d26de779af92a212',
    rewardTokenAddresses: ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55', '0x32eb7902d4134bf98a28b963d26de779af92a212'],
  },
];

const appId = DOPEX_DEFINITION.id;
const groupId = DOPEX_DEFINITION.groups.farm.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumDopexFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<DopexDualRewardStaking> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DopexContractFactory) protected readonly contractFactory: DopexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): DopexDualRewardStaking {
    return this.contractFactory.dopexDualRewardStaking({ address, network });
  }

  async getFarmDefinitions() {
    return FARMS;
  }

  getRewardRates({ contract }: DataPropsStageParams<DopexDualRewardStaking>) {
    return Promise.all([contract.rewardRateDPX(), contract.rewardRateRDPX()]);
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesPerPositionParams<DopexDualRewardStaking>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesPerPositionParams<DopexDualRewardStaking>) {
    return contract.earned(address).then(v => [v.DPXtokensEarned, v.RDPXtokensEarned]);
  }
}
