import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  GetTokenBalancesPerPositionParams,
  TokenStageParams,
} from '~position/template/contract-position.template.position-fetcher';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { StargateContractFactory, StargateVe } from '../contracts';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.ve.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismStargateVeTokenFetcher extends VotingEscrowTemplateContractPositionFetcher<StargateVe> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'VotedEscrow';
  veTokenAddress = '0x43d2761ed16c89a2c4342e2b16a3c61ccf88f05b';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StargateContractFactory) protected readonly contractFactory: StargateContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StargateVe {
    return this.contractFactory.stargateVe({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: TokenStageParams<StargateVe>) {
    return contract.token();
  }

  async getEscrowedTokenBalance({ contract, address }: GetTokenBalancesPerPositionParams<StargateVe>) {
    return (await contract.locked(address)).amount;
  }
}
