import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { SolidLizardDefinitionsResolver } from '../common/solid-lizard.definitions-resolver';
import { SolidLizardViemContractFactory } from '../contracts';
import { SolidLizardPool } from '../contracts/viem';

export type SolidLizardPoolTokenDefinition = {
  address: string;
};

@PositionTemplate()
export class ArbitrumSolidLizardPoolsTokenFetcher extends AppTokenTemplatePositionFetcher<
  SolidLizardPool,
  DefaultAppTokenDataProps,
  SolidLizardPoolTokenDefinition
> {
  groupLabel = 'Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SolidLizardViemContractFactory) private readonly contractFactory: SolidLizardViemContractFactory,
    @Inject(SolidLizardDefinitionsResolver) protected readonly definitionsResolver: SolidLizardDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.solidLizardPool({ address, network: this.network });
  }

  async getDefinitions(): Promise<SolidLizardPoolTokenDefinition[]> {
    return this.definitionsResolver.getPoolTokenDefinitions();
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<SolidLizardPool>) {
    return [
      { address: await contract.read.token0(), network: this.network },
      { address: await contract.read.token1(), network: this.network },
    ];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<SolidLizardPool, DefaultDataProps>) {
    const [token0, token1] = appToken.tokens;
    const [reserve0, reserve1] = await Promise.all([contract.read.reserve0(), contract.read.reserve1()]);
    const reserves = [Number(reserve0) / 10 ** token0.decimals, Number(reserve1) / 10 ** token1.decimals];
    const pricePerShare = reserves.map(r => r / appToken.supply);
    return pricePerShare;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<SolidLizardPool>): Promise<string> {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getApy(): Promise<number> {
    return 0; // TODO
  }

  async getSecondaryLabel({ appToken }: GetDisplayPropsParams<SolidLizardPool>) {
    const { liquidity, reserves } = appToken.dataProps;
    const reservePercentages = appToken.tokens.map((t, i) => reserves[i] * (t.price / liquidity));
    return reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
  }

  async getStatsItems({ appToken }: GetDisplayPropsParams<SolidLizardPool>) {
    const { reserves, liquidity, apy } = appToken.dataProps;
    const reservesDisplay = reserves.map(v => (v < 0.01 ? '<0.01' : v.toFixed(2))).join(' / ');

    return [
      { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
      { label: 'APY', value: buildPercentageDisplayItem(apy) },
      { label: 'Reserves', value: reservesDisplay },
    ];
  }
}
