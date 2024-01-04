import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { AaveStkAave__factory, AaveStkAbpt__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class AaveSafetyModuleViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  aaveStkAave({ address, network }: ContractOpts) {
    return AaveStkAave__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aaveStkAbpt({ address, network }: ContractOpts) {
    return AaveStkAbpt__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
