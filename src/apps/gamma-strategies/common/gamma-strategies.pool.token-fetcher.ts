import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { GammaStrategiesViemContractFactory } from '../contracts';
import { GammaStrategiesHypervisor } from '../contracts/viem';

import { GammaStrategiesDefinitionResolver } from './gamma-strategies.definition-resolver';

export abstract class GammaStrategiesPoolTokenFetcher extends AppTokenTemplatePositionFetcher<GammaStrategiesHypervisor> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GammaStrategiesViemContractFactory) protected readonly contractFactory: GammaStrategiesViemContractFactory,
    @Inject(GammaStrategiesDefinitionResolver) protected readonly definitionResolver: GammaStrategiesDefinitionResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.gammaStrategiesHypervisor({ address, network: this.network });
  }

  async getDefinitions() {
    return this.definitionResolver.getPoolDefinitions(this.network);
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    contract,
  }: GetUnderlyingTokensParams<GammaStrategiesHypervisor, DefaultAppTokenDefinition>) {
    return [
      { address: await contract.read.token0(), network: this.network },
      { address: await contract.read.token1(), network: this.network },
    ];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<GammaStrategiesHypervisor>) {
    const [total0, total1] = await contract.read.getTotalAmounts();
    const reserve0 = Number(total0) / 10 ** appToken.tokens[0].decimals;
    const reserve1 = Number(total1) / 10 ** appToken.tokens[1].decimals;
    const pricePerShare = [reserve0, reserve1].map(r => r / appToken.supply);

    return pricePerShare;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<GammaStrategiesHypervisor>) {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getSecondaryLabel({ appToken }: GetDisplayPropsParams<GammaStrategiesHypervisor>) {
    const { reserves, liquidity } = appToken.dataProps;
    const reservePercentages = appToken.tokens.map((t, i) => reserves[i] * (t.price / liquidity));
    return reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
  }
}
