import { Inject, Injectable } from '@nestjs/common';
import { range, toLower, uniqBy } from 'lodash';
import moment from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { CurveContractFactory } from '~apps/curve/contracts';
import { CURVE_DEFINITION } from '~apps/curve/curve.definition';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import { CurveApiClient } from '../api/curve.api.client';

const ADDRESS_RESOVLER_ADDRESS = '0x0000000022d53366457f9d5e68ec105046fc4383';

@Injectable()
export class CurveOnChainRegistry {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) private readonly curveContractFactory: CurveContractFactory,
    @Inject(CurveApiClient) private readonly curveApiClient: CurveApiClient,
  ) {}

  async getStableSwapRegistryBasePoolDefinitions(network: Network) {
    const definitions = await this.getStableSwapRegistryDefinitions(network);
    return definitions.filter(v => !v.isMetaPool);
  }

  async getStableSwapRegistryMetaPoolDefinitions(network: Network) {
    const definitions = await this.getStableSwapRegistryDefinitions(network);
    return definitions.filter(v => v.isMetaPool);
  }

  async getCryptoSwapRegistryMetaPoolDefinitions(network: Network) {
    const definitions = await this.getCryptoSwapRegistryDefinitions(network);
    return definitions;
  }

  private async getStableSwapRegistryDefinitions(network: Network) {
    const multicall = this.appToolkit.getMulticall(network);
    const gauges = await this.getGauges(network);

    const resolver = this.curveContractFactory.curveAddressResolver({ address: ADDRESS_RESOVLER_ADDRESS, network });
    const mainRegistryInfo = await resolver.get_id_info(0);

    const registry = this.curveContractFactory.curveStableRegistry({ address: mainRegistryInfo.addr, network });
    const poolCount = await registry.pool_count();

    const poolDefinitions = await Promise.all(
      range(0, Number(poolCount)).map(async i => {
        const swapAddress = await multicall.wrap(registry).pool_list(i).then(toLower);
        const tokenAddress = await multicall.wrap(registry).get_lp_token(swapAddress).then(toLower);
        const gaugeAddress = gauges.find(v => v.swapAddress === swapAddress)?.gaugeAddress ?? ZERO_ADDRESS;
        const isMetaPool = await multicall.wrap(registry).is_meta(swapAddress);
        return { swapAddress, tokenAddress, gaugeAddress, isMetaPool };
      }),
    );

    return poolDefinitions;
  }

  private async getCryptoSwapRegistryDefinitions(network: Network) {
    const multicall = this.appToolkit.getMulticall(network);
    const gauges = await this.getGauges(network);

    const resolver = this.curveContractFactory.curveAddressResolver({ address: ADDRESS_RESOVLER_ADDRESS, network });
    const cryptoRegistryInfo = await resolver.get_id_info(5);

    const registry = this.curveContractFactory.curveCryptoRegistry({ address: cryptoRegistryInfo.addr, network });
    const poolCount = await registry.pool_count();

    const poolDefinitions = await Promise.all(
      range(0, Number(poolCount)).map(async i => {
        const swapAddress = await multicall.wrap(registry).pool_list(i).then(toLower);
        const tokenAddress = await multicall.wrap(registry).get_lp_token(swapAddress).then(toLower);
        const gaugeAddress = gauges.find(v => v.swapAddress === swapAddress)?.gaugeAddress ?? ZERO_ADDRESS;
        return { swapAddress, tokenAddress, gaugeAddress, isMetaPool: false };
      }),
    );

    return poolDefinitions;
  }

  @Cache({
    instance: 'business',
    key: (network: Network) => `studio:${CURVE_DEFINITION.id}:${network}:gauges`,
    ttl: moment.duration(15, 'minutes').asSeconds(),
  })
  private async getGauges(network: Network) {
    const mainGauges = await this.curveApiClient.getMainGauges(network);
    const factoryGauges = await this.curveApiClient.getFactoryGauges(network);
    const gauges = uniqBy([...mainGauges, ...factoryGauges], v => v.swapAddress);
    return gauges;
  }
}
