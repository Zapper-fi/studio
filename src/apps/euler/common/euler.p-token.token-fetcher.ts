import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetAddressesParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { EulerViemContractFactory } from '../contracts';
import { EulerPtokenContract } from '../contracts/viem';

import { EulerTokenDefinition, EulerTokenDefinitionsResolver, EulerTokenType } from './euler.token-definition-resolver';

export abstract class EulerPTokenTokenFetcher extends AppTokenTemplatePositionFetcher<
  EulerPtokenContract,
  DefaultAppTokenDataProps,
  EulerTokenDefinition
> {
  abstract tokenType: EulerTokenType;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(EulerTokenDefinitionsResolver)
    private readonly tokenDefinitionsResolver: EulerTokenDefinitionsResolver,
    @Inject(EulerViemContractFactory) protected readonly contractFactory: EulerViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.eulerPtokenContract({ network: this.network, address });
  }

  async getDefinitions(): Promise<EulerTokenDefinition[]> {
    return this.tokenDefinitionsResolver.getTokenDefinitions(this.tokenType);
  }

  async getAddresses({ definitions }: GetAddressesParams<EulerTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<EulerPtokenContract, EulerTokenDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getSymbol({ address }): Promise<string> {
    const market = await this.tokenDefinitionsResolver.getMarket(address, this.tokenType);
    return `P${market!.symbol}`;
  }
}
