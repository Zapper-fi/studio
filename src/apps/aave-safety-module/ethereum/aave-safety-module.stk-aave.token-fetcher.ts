import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { AAVE_SAFETY_MODULE_DEFINITION } from '../aave-safety-module.definition';
import { AaveSafetyModuleContractFactory, AaveStkAave } from '../contracts';

type AaveSafetyModuleStkAaveTokenDataProps = {
  apy: number;
  liquidity: number;
};

@Injectable()
export class EthereumAaveSafetyModuleStkAaveTokenFetcher extends AppTokenTemplatePositionFetcher<
  AaveStkAave,
  AaveSafetyModuleStkAaveTokenDataProps
> {
  appId = AAVE_SAFETY_MODULE_DEFINITION.id;
  groupId = AAVE_SAFETY_MODULE_DEFINITION.groups.stkAave.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'stkAAVE';

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

  async getDataProps({ multicall, appToken }: GetDataPropsParams<AaveStkAave, AaveSafetyModuleStkAaveTokenDataProps>) {
    const helperAddress = '0xa82247b44750ae23076d6746a9b5b8dc0ecbb646';
    const stkApyHelperContract = this.contractFactory.aaveStkApyHelper({
      network: this.network,
      address: helperAddress,
    });

    const stkAaveData = await multicall.wrap(stkApyHelperContract).getStkAaveData(ZERO_ADDRESS);
    const liquidity = appToken.price * appToken.supply;
    const apy = (+stkAaveData[5] / 1e4) * 100;
    return { liquidity, apy };
  }
}
