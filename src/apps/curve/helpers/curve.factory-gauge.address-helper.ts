import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CurveContractFactory } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';

import { CurvePoolTokenDataProps } from './curve.pool.token-helper';

type CurveFactoryGaugeAddressHelperParams = {
  factoryAddress: string;
  network: Network;
  getPoolAddress?: (poolToken: AppTokenPosition<CurvePoolTokenDataProps>) => string;
};

@Injectable()
export class CurveFactoryGaugeAddressHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) private readonly curveContractFactory: CurveContractFactory,
  ) {}

  async getGaugeAddresses({ factoryAddress, network, getPoolAddress }: CurveFactoryGaugeAddressHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const factoryContract = this.curveContractFactory.curveFactoryV2({ address: factoryAddress, network });
    const poolTokens = await this.appToolkit.getAppTokenPositions<CurvePoolTokenDataProps>({
      appId: CURVE_DEFINITION.id,
      groupIds: [CURVE_DEFINITION.groups.pool.id],
      network,
    });

    const maybeGaugeAddresses = await Promise.all(
      poolTokens.map(async poolToken => {
        const tokenAddress = getPoolAddress ? getPoolAddress(poolToken) : poolToken.address;
        const gaugeAddressRaw = await multicall.wrap(factoryContract).get_gauge(tokenAddress);
        const gaugeAddress = gaugeAddressRaw.toLowerCase();
        return gaugeAddress;
      }),
    );

    return maybeGaugeAddresses.filter(v => v !== ZERO_ADDRESS);
  }
}
