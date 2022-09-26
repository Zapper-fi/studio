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

import { BalancerV2ContractFactory, BalancerVeBal } from '../contracts';

@PositionTemplate()
export class EthereumBalancerV2VotingEscrowContractPositionFetcher extends ContractPositionTemplatePositionFetcher<BalancerVeBal> {
  groupLabel = 'Voting Escrow';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BalancerV2ContractFactory) protected readonly contractFactory: BalancerV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BalancerVeBal {
    return this.contractFactory.balancerVeBal({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0xc128a9954e6c874ea3d62ce62b468ba073093f25' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<BalancerVeBal>) {
    const tokenAddress = await contract.token();
    return [{ metaType: MetaType.SUPPLIED, address: tokenAddress }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<BalancerVeBal>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `Voting Escrow ${getLabelFromToken(suppliedToken)}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<BalancerVeBal>) {
    const lockedBalance = await contract.locked(address);
    return [lockedBalance.amount];
  }
}
