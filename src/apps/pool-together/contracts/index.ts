import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PoolTogetherMerkleDistributor__factory } from './ethers';
import { PoolTogetherMultiTokenListener__factory } from './ethers';
import { PoolTogetherMultipleWinnersPrizeStrategy__factory } from './ethers';
import { PoolTogetherPod__factory } from './ethers';
import { PoolTogetherPodRegistry__factory } from './ethers';
import { PoolTogetherPoolFaucet__factory } from './ethers';
import { PoolTogetherPrizePool__factory } from './ethers';
import { PoolTogetherPrizeTicket__factory } from './ethers';
import { PoolTogetherV4PrizePool__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PoolTogetherContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  poolTogetherMerkleDistributor({ address, network }: ContractOpts) {
    return PoolTogetherMerkleDistributor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherMultiTokenListener({ address, network }: ContractOpts) {
    return PoolTogetherMultiTokenListener__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherMultipleWinnersPrizeStrategy({ address, network }: ContractOpts) {
    return PoolTogetherMultipleWinnersPrizeStrategy__factory.connect(
      address,
      this.appToolkit.getNetworkProvider(network),
    );
  }
  poolTogetherPod({ address, network }: ContractOpts) {
    return PoolTogetherPod__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherPodRegistry({ address, network }: ContractOpts) {
    return PoolTogetherPodRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherPoolFaucet({ address, network }: ContractOpts) {
    return PoolTogetherPoolFaucet__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherPrizePool({ address, network }: ContractOpts) {
    return PoolTogetherPrizePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherPrizeTicket({ address, network }: ContractOpts) {
    return PoolTogetherPrizeTicket__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherV4PrizePool({ address, network }: ContractOpts) {
    return PoolTogetherV4PrizePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PoolTogetherMerkleDistributor } from './ethers';
export type { PoolTogetherMultiTokenListener } from './ethers';
export type { PoolTogetherMultipleWinnersPrizeStrategy } from './ethers';
export type { PoolTogetherPod } from './ethers';
export type { PoolTogetherPodRegistry } from './ethers';
export type { PoolTogetherPoolFaucet } from './ethers';
export type { PoolTogetherPrizePool } from './ethers';
export type { PoolTogetherPrizeTicket } from './ethers';
export type { PoolTogetherV4PrizePool } from './ethers';
