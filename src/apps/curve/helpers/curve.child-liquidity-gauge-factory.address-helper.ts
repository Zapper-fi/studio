import { Inject, Injectable } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Network } from '~types/network.interface';

import { CurveContractFactory } from '../contracts';

type CurveFactoryGaugeAddressHelperParams = {
  factoryAddress: string;
  network: Network;
};

@Injectable()
export class CurveChildLiquidityGaugeFactoryAddressHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) private readonly curveContractFactory: CurveContractFactory,
  ) {}

  async getGaugeAddresses({ factoryAddress, network }: CurveFactoryGaugeAddressHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const factoryContract = this.curveContractFactory.curveChildLiquidityGaugeFactory({
      address: factoryAddress,
      network,
    });

    const count = await multicall.wrap(factoryContract).get_gauge_count();

    const gaugeAddresses = await Promise.all(
      range(0, Number(count)).map(async index => {
        const gaugeAddressRaw = await multicall.wrap(factoryContract).get_gauge(index);
        const gaugeAddress = gaugeAddressRaw.toLowerCase();
        return gaugeAddress;
      }),
    );

    return gaugeAddresses.filter(v => v !== ZERO_ADDRESS);
  }
}
