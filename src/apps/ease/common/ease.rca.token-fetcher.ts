import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetUnderlyingTokensParams,
  GetAddressesParams,
  DefaultAppTokenDataProps,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { EaseViemContractFactory } from '../contracts';
import { EaseRcaShield } from '../contracts/viem';

import { EaseRcaDefinitionsResolver } from './ease.rca-definition-resolver';

export type EaseRcaTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

export abstract class EaseRcaTokenFetcher extends AppTokenTemplatePositionFetcher<
  EaseRcaShield,
  DefaultAppTokenDataProps,
  EaseRcaTokenDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(EaseRcaDefinitionsResolver)
    private readonly vaultDefinitionsResolver: EaseRcaDefinitionsResolver,
    @Inject(EaseViemContractFactory) protected readonly contractFactory: EaseViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.easeRcaShield({ network: this.network, address });
  }

  async getDefinitions(): Promise<EaseRcaTokenDefinition[]> {
    return this.vaultDefinitionsResolver.getRcaDefinitions();
  }

  async getAddresses({ definitions }: GetAddressesParams<EaseRcaTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<EaseRcaShield, EaseRcaTokenDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getApy({ appToken }: GetDataPropsParams<EaseRcaShield>) {
    return this.vaultDefinitionsResolver.getRcaApy(appToken.address);
  }

  async getLabel({ appToken }: GetDisplayPropsParams<EaseRcaShield>) {
    return getLabelFromToken(appToken.tokens[0]);
  }
}
