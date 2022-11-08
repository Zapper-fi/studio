import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { QiDaoAnchorVault__factory } from './ethers';
import { QiDaoEscrowedQi__factory } from './ethers';
import { QiDaoMasterChef__factory } from './ethers';
import { QiDaoVaultInfo__factory } from './ethers';
import { QiDaoVaultNft__factory } from './ethers';
import { QiDaoYieldToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class QiDaoContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  qiDaoAnchorVault({ address, network }: ContractOpts) {
    return QiDaoAnchorVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  qiDaoEscrowedQi({ address, network }: ContractOpts) {
    return QiDaoEscrowedQi__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  qiDaoMasterChef({ address, network }: ContractOpts) {
    return QiDaoMasterChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  qiDaoVaultInfo({ address, network }: ContractOpts) {
    return QiDaoVaultInfo__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  qiDaoVaultNft({ address, network }: ContractOpts) {
    return QiDaoVaultNft__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  qiDaoYieldToken({ address, network }: ContractOpts) {
    return QiDaoYieldToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { QiDaoAnchorVault } from './ethers';
export type { QiDaoEscrowedQi } from './ethers';
export type { QiDaoMasterChef } from './ethers';
export type { QiDaoVaultInfo } from './ethers';
export type { QiDaoVaultNft } from './ethers';
export type { QiDaoYieldToken } from './ethers';
