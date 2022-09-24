import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { AaveSafetyModuleContractFactory, AaveStkAave } from '../contracts';

@PositionTemplate()
export class EthereumAaveSafetyModuleStkAaveTokenFetcher extends AppTokenTemplatePositionFetcher<AaveStkAave> {
  groupLabel = 'stkAAVE';

  stkApyHelperAddress = '0xa82247b44750ae23076d6746a9b5b8dc0ecbb646';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AaveSafetyModuleContractFactory) protected readonly contractFactory: AaveSafetyModuleContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AaveStkAave {
    return this.contractFactory.aaveStkAave({ address, network: this.network });
  }

  async getAddresses() {
    return ['0x4da27a545c0c5b758a6ba100e3a049001de870f5'];
  }

  async getUnderlyingTokenAddresses(_params: GetUnderlyingTokensParams<AaveStkAave>) {
    return ['0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'];
  }

  getLiquidity({ appToken }: GetDataPropsParams<AaveStkAave>) {
    return appToken.price * appToken.supply;
  }

  getReserves({ appToken }: GetDataPropsParams<AaveStkAave>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy({ multicall }: GetDataPropsParams<AaveStkAave>) {
    const stkApyHelperContract = this.contractFactory.aaveStkApyHelper({
      address: this.stkApyHelperAddress,
      network: this.network,
    });

    const stkAaveData = await multicall.wrap(stkApyHelperContract).getStkAaveData(ZERO_ADDRESS);
    const apy = (+stkAaveData[5] / 1e4) * 100;
    return apy;
  }
}
