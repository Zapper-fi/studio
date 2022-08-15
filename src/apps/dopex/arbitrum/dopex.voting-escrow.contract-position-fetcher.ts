import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import {
  ContractPositionTemplatePositionFetcher,
  DisplayPropsStageParams,
  GetTokenBalancesPerPositionParams,
  TokenStageParams,
} from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types/network.interface';

import { DopexContractFactory, DopexVotingEscrow } from '../contracts';
import { DOPEX_DEFINITION } from '../dopex.definition';

const appId = DOPEX_DEFINITION.id;
const groupId = DOPEX_DEFINITION.groups.votingEscrow.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumDopexVotingEscrowContractPositionFetcher extends ContractPositionTemplatePositionFetcher<DopexVotingEscrow> {
  appId = appId;
  groupId = groupId;
  network = network;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DopexContractFactory) protected readonly contractFactory: DopexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): DopexVotingEscrow {
    return this.contractFactory.dopexVotingEscrow({ address, network: this.network });
  }

  async getDescriptors() {
    return [{ address: '0x80789d252a288e93b01d82373d767d71a75d9f16' }];
  }

  async getTokenDescriptors({ contract }: TokenStageParams<DopexVotingEscrow>) {
    return [{ metaType: MetaType.SUPPLIED, address: await contract.token() }];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<DopexVotingEscrow>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `Voting Escrow ${getLabelFromToken(suppliedToken)}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesPerPositionParams<DopexVotingEscrow>) {
    const lockedBalance = await contract.locked(address);
    return [lockedBalance.amount];
  }
}
