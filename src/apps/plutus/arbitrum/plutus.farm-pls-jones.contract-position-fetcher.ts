import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { GetTokenBalancesPerPositionParams } from '~position/template/contract-position.template.position-fetcher';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { PlutusContractFactory, PlutusFarmPlsJones } from '../contracts';
import PLUTUS_DEFINITION from '../plutus.definition';

const appId = PLUTUS_DEFINITION.id;
const groupId = PLUTUS_DEFINITION.groups.farmPlsJones.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusFarmPlsJonesContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<PlutusFarmPlsJones> {
  appId = PLUTUS_DEFINITION.id;
  groupId = PLUTUS_DEFINITION.groups.farmPlsJones.id;
  network = Network.ARBITRUM_MAINNET;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) protected readonly contractFactory: PlutusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PlutusFarmPlsJones {
    return this.contractFactory.plutusFarmPlsJones({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return [
      {
        address: '0x23b87748b615096d1a0f48870daee203a720723d',
        stakedTokenAddress: '0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44',
        rewardTokenAddresses: [
          '0x51318b7d00db7acc4026c88c3952b66278b6a67f', // PLS
          '0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1', // plsDPX
          '0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44', // plsJONES
          '0x10393c20975cf177a3513071bc110f7962cd67da', // JONES
        ],
      },
    ];
  }

  async getRewardRates(contract: PlutusFarmPlsJones) {
    const rewardsDistro = await contract.rewardsDistro();
    const rewardsDistroContract = this.contractFactory.plutusRewardsDistroPlsJones({
      address: rewardsDistro,
      network: this.network,
    });

    const emissions = await rewardsDistroContract.getEmissions();
    return [emissions.pls_, emissions.plsDpx_, emissions.plsJones_, emissions.jones_];
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesPerPositionParams<PlutusFarmPlsJones>) {
    return contract.userInfo(address).then(v => v.amount);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesPerPositionParams<PlutusFarmPlsJones>) {
    return contract.pendingRewards(address);
  }
}
