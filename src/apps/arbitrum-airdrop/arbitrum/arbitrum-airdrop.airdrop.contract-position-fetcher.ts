import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetTokenBalancesParams,
  GetDisplayPropsParams,
} from '~position/template/contract-position.template.types';

import { ArbitrumAirdropContractFactory, TokenDistributor } from '../contracts';

const TOKEN_DISTRIBUTOR = '0x67a24ce4321ab3af51c2d0a4801c3e111d88c9d9';
const ARB_TOKEN = '0x912ce59144191c1204e64559fe8253a0e49e6548';

@PositionTemplate()
export class ArbitrumArbitrumAirdropAirdropContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Contract> {
  groupLabel = 'airdrop';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ArbitrumAirdropContractFactory)
    protected readonly arbitrumAirdropContractFactory: ArbitrumAirdropContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(_address: string): Contract {
    return this.arbitrumAirdropContractFactory.tokenDistributor({
      address: _address,
      network: this.network,
    });
  }

  async getLabel(
    _params: GetDisplayPropsParams<Contract, DefaultDataProps, DefaultContractPositionDefinition>,
  ): Promise<string> {
    return 'Arbitrum Airdrop';
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: TOKEN_DISTRIBUTOR }];
  }

  async getTokenDefinitions(
    _params: GetTokenDefinitionsParams<Contract, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    return [{ metaType: MetaType.CLAIMABLE, address: ARB_TOKEN, network: this.network }];
  }

  async getTokenBalancesPerPosition(
    params: GetTokenBalancesParams<TokenDistributor, DefaultDataProps>,
  ): Promise<BigNumberish[]> {
    return [await params.contract.claimableTokens(params.address)];
  }
}
