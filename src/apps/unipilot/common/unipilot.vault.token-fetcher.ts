import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MetaType } from '~position/position.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';
import { GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

import { UnipilotContractFactory, UnipilotVault } from '../contracts';
import { UnipilotVaultDefinition } from '../utils/generalTypes';

import { UnipilotVaultDefinitionsResolver } from './unipilot.vault-definition-resolver';

export type UnipilotVaultTokenDataProps = DefaultAppTokenDataProps & {
  fee: number;
};

export abstract class UnipilotVaultTokenFetcher extends AppTokenTemplatePositionFetcher<
  UnipilotVault,
  UnipilotVaultTokenDataProps,
  UnipilotVaultDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UnipilotVaultDefinitionsResolver)
    private readonly vaultDefinitionsResolver: UnipilotVaultDefinitionsResolver,
    @Inject(UnipilotContractFactory)
    private readonly contractFactory: UnipilotContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): UnipilotVault {
    return this.contractFactory.unipilotVault({ address, network: this.network });
  }

  async getDefinitions(): Promise<UnipilotVaultDefinition[]> {
    return this.vaultDefinitionsResolver.getVaultDefinitions(this.network);
  }

  async getAddresses({ definitions }: GetAddressesParams<UnipilotVaultDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<UnipilotVault, UnipilotVaultDefinition>) {
    return [
      { address: definition.token0Address, network: this.network },
      { address: definition.token1Address, network: this.network },
    ];
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<UnipilotVault, UnipilotVaultDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.token0Address,
        network: this.network,
      },
      {
        metaType: MetaType.SUPPLIED,
        address: definition.token1Address,
        network: this.network,
      },
    ];
  }

  async getPricePerShare({
    appToken,
    definition,
  }: GetPricePerShareParams<UnipilotVault, UnipilotVaultTokenDataProps, UnipilotVaultDefinition>) {
    const { totalLockedToken0, totalLockedToken1 } = definition;
    const reservesRaw = [totalLockedToken0, totalLockedToken1];
    const reserves = reservesRaw.map((r, i) => Number(r) / 10 ** appToken.tokens[i].decimals);
    const pricePerShare = reserves.map(r => {
      return r == 0 ? 0 : r / appToken.supply;
    });
    return pricePerShare;
  }

  async getLabel({
    appToken,
    definition,
  }: GetDisplayPropsParams<UnipilotVault, UnipilotVaultTokenDataProps, UnipilotVaultDefinition>): Promise<string> {
    const strategyLabels = {
      '0': '',
      '1': 'Wide',
      '2': 'Balanced',
      '3': 'Narrow',
    };
    const { feeTier, strategyId } = definition;
    const { tokens } = appToken;

    const feeTierLabel = parseFloat(feeTier) / 10000 + '%';

    const strategyLabel: string = strategyId ? strategyLabels[strategyId] : '';
    const label = `${tokens[0].symbol}/${tokens[1].symbol} ${feeTierLabel} ${strategyLabel}`;

    return label;
  }

  async getSecondaryLabel({
    appToken,
  }: GetDisplayPropsParams<UnipilotVault, UnipilotVaultTokenDataProps, UnipilotVaultDefinition>) {
    const { liquidity, reserves } = appToken.dataProps;
    const reservePercentages = appToken.tokens.map((t, i) => reserves[i] * (t.price / liquidity));
    return reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
  }
}
