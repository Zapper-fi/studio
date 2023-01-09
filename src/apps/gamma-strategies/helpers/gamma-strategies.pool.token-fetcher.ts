import { Inject } from '@nestjs/common';
import { keys } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { GammaStrategiesContractFactory, GammaStrategiesHypervisor } from '../contracts';

import { GammaApiHelper } from './gamma-strategies.api'

export class GammaStrategiesPoolTokenFetcher extends AppTokenTemplatePositionFetcher<GammaStrategiesHypervisor> {
  groupLabel = 'Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GammaStrategiesContractFactory) protected readonly contractFactory: GammaStrategiesContractFactory,
    @Inject(GammaApiHelper) protected readonly gammaApiHelper,
  ) {
    super(appToolkit);
  }

  getContract(address: string): GammaStrategiesHypervisor {
    return this.contractFactory.gammaStrategiesHypervisor({ address, network: this.network });
  }

  getDataUrls(): Array<string> {
    return [`https://gammawire.net/${this.network}/hypervisors/allData`]
  }

  async getAddresses() {
    const urls = this.getDataUrls();
    const vaultData = await this.gammaApiHelper.getVaultDefinitionsData(urls);
    return keys(vaultData);
  }

  async getUnderlyingTokenDefinitions({
    contract,
  }: GetUnderlyingTokensParams<GammaStrategiesHypervisor, DefaultAppTokenDefinition>) {
    return [
      { address: await contract.token0(), network: this.network },
      { address: await contract.token1(), network: this.network },
    ];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<GammaStrategiesHypervisor>) {
    const totalAmountInfo = await contract.getTotalAmounts();
    const reserve0 = Number(totalAmountInfo.total0) / 10 ** appToken.tokens[0].decimals;
    const reserve1 = Number(totalAmountInfo.total1) / 10 ** appToken.tokens[1].decimals;
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


