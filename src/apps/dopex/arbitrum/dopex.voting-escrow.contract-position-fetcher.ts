import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { DopexContractFactory, DopexVotingEscrow } from '../contracts';

@PositionTemplate()
export class ArbitrumDopexVotingEscrowContractPositionFetcher extends ContractPositionTemplatePositionFetcher<DopexVotingEscrow> {
  groupLabel = 'Voting Escrow';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DopexContractFactory) protected readonly contractFactory: DopexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): DopexVotingEscrow {
    return this.contractFactory.dopexVotingEscrow({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x80789d252a288e93b01d82373d767d71a75d9f16' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<DopexVotingEscrow>) {
    return [{ metaType: MetaType.SUPPLIED, address: await contract.token() }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<DopexVotingEscrow>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `Voting Escrow ${getLabelFromToken(suppliedToken)}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<DopexVotingEscrow>) {
    const lockedBalance = await contract.locked(address);
    return [lockedBalance.amount];
  }
}
