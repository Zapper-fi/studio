import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { PickleViemContractFactory } from '../contracts';

type GetJarDefinitionsParams = {
  network: Network;
};

const SUPPORTED_REGISTRIES = {
  [Network.ARBITRUM_MAINNET]: '0x63292afc5567c19738e2ed6aedc840e5abca910c',
  [Network.POLYGON_MAINNET]: '0x3419d74f5909e7579c1259f6638f82143bd536b1',
};

@Injectable()
export class PickleOnChainJarRegistry {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PickleViemContractFactory) protected readonly pickleContractFactory: PickleViemContractFactory,
  ) {}

  async getJarDefinitions({ network }: GetJarDefinitionsParams) {
    const registryAddress = SUPPORTED_REGISTRIES[network];
    const multicall = this.appToolkit.getViemMulticall(network);

    const contract = this.pickleContractFactory.pickleRegistry({ address: registryAddress, network });
    const vaultAddresses = await contract.read.developmentVaults();

    const vaultData = await Promise.all(
      vaultAddresses.map(async vaultAddressRaw => {
        const vaultAddress = vaultAddressRaw.toLowerCase();
        const vaultContract = this.pickleContractFactory.pickleJar({ address: vaultAddress, network });
        const tokenAddressRaw = await multicall.wrap(vaultContract).read.token();
        const tokenAddress = tokenAddressRaw.toLowerCase();
        return { vaultAddress, tokenAddress };
      }),
    );

    return vaultData;
  }
}
