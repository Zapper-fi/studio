import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { AAVE_SAFETY_MODULE_DEFINITION } from '../aave-safety-module.definition';
import { AaveSafetyModuleContractFactory, AaveStkAbpt } from '../contracts';

type AaveSafetyModuleStkAbptTokenDataProps = {
  apy: number;
  liquidity: number;
};

@Injectable()
export class EthereumAaveSafetyModuleStkAbptTokenFetcher extends AppTokenTemplatePositionFetcher<
  AaveStkAbpt,
  AaveSafetyModuleStkAbptTokenDataProps
> {
  appId = AAVE_SAFETY_MODULE_DEFINITION.id;
  groupId = AAVE_SAFETY_MODULE_DEFINITION.groups.stkAbpt.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'stkABPT';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AaveSafetyModuleContractFactory) protected readonly contractFactory: AaveSafetyModuleContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AaveStkAbpt {
    return this.contractFactory.aaveStkAbpt({ address, network: this.network });
  }

  async getAddresses() {
    return ['0xa1116930326d21fb917d5a27f1e9943a9595fb47'];
  }

  async getUnderlyingTokenAddresses() {
    return ['0x41a08648c3766f9f9d85598ff102a08f4ef84f84'];
  }

  async getDataProps({ multicall, appToken }: GetDataPropsParams<AaveStkAbpt, AaveSafetyModuleStkAbptTokenDataProps>) {
    const helperAddress = '0xa82247b44750ae23076d6746a9b5b8dc0ecbb646';
    const stkApyHelperContract = this.contractFactory.aaveStkApyHelper({
      network: this.network,
      address: helperAddress,
    });

    const stkAaveData = await multicall.wrap(stkApyHelperContract).getStkBptData(ZERO_ADDRESS);
    const liquidity = appToken.price * appToken.supply;
    const apy = (+stkAaveData[5] / 1e4) * 100;
    return { liquidity, apy };
  }
}
