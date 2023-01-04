import { Inject } from '@nestjs/common';
import { difference } from 'lodash';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { GammaStrategiesContractFactory, GammaStrategiesHypervisor } from '../contracts';

const FACTORY_ADDRESSES = [
  '0xd12fa3e3b60cfb96a735ab57a071f0f324860929',
  '0xc878c38f0df509a833d10de892e1cf7d361e3a67',
  '0x0ac51fb63d1915a77ab7a7bb53b031407584dd4c',
];

const DEPRECATED_HYPERVISORS = [
  '0xce721b5dc9624548188b5451bb95989a7927080a',
  '0x0e9e16f6291ba2aaaf41ccffdf19d32ab3691d15',
];

@PositionTemplate()
export class EthereumGammaStrategiesPoolTokenFetcher extends AppTokenTemplatePositionFetcher<GammaStrategiesHypervisor> {
  groupLabel = 'Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GammaStrategiesContractFactory) protected readonly contractFactory: GammaStrategiesContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): GammaStrategiesHypervisor {
    return this.contractFactory.gammaStrategiesHypervisor({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams<DefaultAppTokenDefinition>) {
    const hypervisorAddresses = await Promise.all(
      FACTORY_ADDRESSES.map(async factoryAddress => {
        const factoryContract = this.contractFactory.gammaStrategiesHypervisorFactory({
          address: factoryAddress,
          network: this.network,
        });

        const numTokens = await multicall.wrap(factoryContract).allHypervisorsLength();
        const addresses = await Promise.all(
          range(0, Number(numTokens)).map(i => multicall.wrap(factoryContract).allHypervisors(i)),
        );

        return addresses;
      }),
    );

    return difference(hypervisorAddresses.flat(), DEPRECATED_HYPERVISORS);
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
