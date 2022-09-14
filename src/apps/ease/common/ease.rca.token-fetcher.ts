import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildNumberDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetUnderlyingTokensParams,
  GetAddressesParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { EaseContractFactory, EaseRcaShield } from '../contracts';

import { EaseRcaDefinitionsResolver } from './ease.rca-definition-resolver';

export type EaseRcaTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

export type EaseRcaDataProps = {
  liquidity: number;
  reserve: number;
  apy: number;
};

export abstract class EaseRcaTokenFetcher extends AppTokenTemplatePositionFetcher<
  EaseRcaShield,
  EaseRcaDataProps,
  EaseRcaTokenDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(EaseRcaDefinitionsResolver)
    private readonly vaultDefinitionsResolver: EaseRcaDefinitionsResolver,
    @Inject(EaseContractFactory) protected readonly contractFactory: EaseContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): EaseRcaShield {
    return this.contractFactory.easeRcaShield({ network: this.network, address });
  }

  async getDefinitions(): Promise<EaseRcaTokenDefinition[]> {
    return this.vaultDefinitionsResolver.getRcaDefinitions();
  }

  async getAddresses({ definitions }: GetAddressesParams<EaseRcaTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenAddresses({ definition }: GetUnderlyingTokensParams<EaseRcaShield, EaseRcaTokenDefinition>) {
    return definition.underlyingTokenAddress;
  }

  async getDataProps({ appToken }: GetDataPropsParams<EaseRcaShield, EaseRcaDataProps, EaseRcaTokenDefinition>) {
    const reserve = Number(appToken.pricePerShare) * appToken.supply;
    const liquidity = reserve * appToken.tokens[0].price;
    const apy = await this.vaultDefinitionsResolver.getRcaApy(appToken.address);

    return { liquidity, reserve, apy };
  }

  async getStatsItems({ appToken }: GetDisplayPropsParams<EaseRcaShield, EaseRcaDataProps>) {
    return [
      { label: 'Liquidity', value: buildDollarDisplayItem(appToken.dataProps.liquidity) },
      { label: 'Reserve', value: buildNumberDisplayItem(appToken.dataProps.reserve) },
      { label: 'APY', value: buildPercentageDisplayItem(appToken.dataProps.apy) },
    ];
  }
}
