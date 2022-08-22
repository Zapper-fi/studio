import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  DataPropsStageParams,
  GetTokenBalancesPerPositionParams,
} from '~position/template/contract-position.template.position-fetcher';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';
import { Network } from '~types';

import { RariContractFactory, RariGovernanceTokenDistributor } from '../contracts';
import { RARI_DEFINITION } from '../rari.definition';

const FARMS = [
  // RGT
  {
    address: '0x9c0caeb986c003417d21a7daaf30221d61fc1043',
    stakedTokenAddress: '0xd291e7a03283640fdc51b121ac401383a46cc623',
    rewardTokenAddresses: ['0xd291e7a03283640fdc51b121ac401383a46cc623'],
  },
];

const appId = RARI_DEFINITION.id;
const groupId = RARI_DEFINITION.groups.governance.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumRariGovernanceContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<RariGovernanceTokenDistributor> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Governance';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RariContractFactory) protected readonly contractFactory: RariContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): RariGovernanceTokenDistributor {
    return this.contractFactory.rariGovernanceTokenDistributor({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  async getRewardRates(_params: DataPropsStageParams<RariGovernanceTokenDistributor>) {
    return [0];
  }

  async getStakedTokenBalance(_params: GetTokenBalancesPerPositionParams<RariGovernanceTokenDistributor>) {
    return [0];
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesPerPositionParams<RariGovernanceTokenDistributor>) {
    return contract.getUnclaimedRgt(address);
  }
}
