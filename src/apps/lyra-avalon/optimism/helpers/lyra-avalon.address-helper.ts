import { Inject, Injectable } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { LyraAvalonContractFactory } from '../../contracts';

const network = Network.OPTIMISM_MAINNET;

const REGISTRY_ADDRESS = '0x7c7AbDdbCb6c731237f7546d3e4c5165531fb0c1'.toLowerCase();

@Injectable()
export class OptimismLyraAvalonAddressHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LyraAvalonContractFactory) private readonly contractFactory: LyraAvalonContractFactory,
  ) { }

  async getAddresses(address: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const registryContract = this.contractFactory.lyraRegistry({ address: REGISTRY_ADDRESS, network })
    const addresses = await multicall.wrap(registryContract).marketAddresses(address);
    return addresses
  }

}