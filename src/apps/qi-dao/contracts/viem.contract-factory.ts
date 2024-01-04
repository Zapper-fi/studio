import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  QiDaoAnchorVault__factory,
  QiDaoEscrowedQi__factory,
  QiDaoMasterChef__factory,
  QiDaoMasterChefV3__factory,
  QiDaoVaultInfo__factory,
  QiDaoVaultNft__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class QiDaoViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  qiDaoAnchorVault({ address, network }: ContractOpts) {
    return QiDaoAnchorVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  qiDaoEscrowedQi({ address, network }: ContractOpts) {
    return QiDaoEscrowedQi__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  qiDaoMasterChef({ address, network }: ContractOpts) {
    return QiDaoMasterChef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  qiDaoMasterChefV3({ address, network }: ContractOpts) {
    return QiDaoMasterChefV3__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  qiDaoVaultInfo({ address, network }: ContractOpts) {
    return QiDaoVaultInfo__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  qiDaoVaultNft({ address, network }: ContractOpts) {
    return QiDaoVaultNft__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
