import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  DataPropsStageParams,
  GetTokenBalancesPerPositionParams,
} from '~position/template/contract-position.template.position-fetcher';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { PlutusContractFactory, PlutusFarmPlsDpx } from '../contracts';
import PLUTUS_DEFINITION from '../plutus.definition';

const appId = PLUTUS_DEFINITION.id;
const groupId = PLUTUS_DEFINITION.groups.farmPlsDpx.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusFarmPlsDpxContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<PlutusFarmPlsDpx> {
  appId = PLUTUS_DEFINITION.id;
  groupId = PLUTUS_DEFINITION.groups.farmPlsDpx.id;
  network = Network.ARBITRUM_MAINNET;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) protected readonly contractFactory: PlutusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PlutusFarmPlsDpx {
    return this.contractFactory.plutusFarmPlsDpx({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return [
      {
        address: '0x20df4953ba19c74b2a46b6873803f28bf640c1b5',
        stakedTokenAddress: '0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1',
        rewardTokenAddresses: [
          '0x51318b7d00db7acc4026c88c3952b66278b6a67f', // PLS
          '0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1', // plsDPX
          '0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44', // plsJONES
          '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55', // DPX
          '0x32eb7902d4134bf98a28b963d26de779af92a212', // rDPX
        ],
      },
    ];
  }

  async getRewardRates({ contract }: DataPropsStageParams<PlutusFarmPlsDpx, SingleStakingFarmDataProps>) {
    const rewardsDistro = await contract.rewardsDistro();
    const rewardsDistroContract = this.contractFactory.plutusRewardsDistroPlsDpx({
      address: rewardsDistro,
      network: this.network,
    });

    const emissions = await rewardsDistroContract.getEmissions();
    return [emissions.pls_, emissions.plsDpx_, emissions.plsJones_, emissions.dpx_, emissions.rdpx_];
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesPerPositionParams<PlutusFarmPlsDpx>) {
    return contract.userInfo(address).then(v => v.amount);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesPerPositionParams<PlutusFarmPlsDpx>) {
    return contract.pendingRewards(address);
  }
}
