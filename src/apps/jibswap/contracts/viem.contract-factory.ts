
import { Injectable, Inject } from '@nestjs/common'
import { PublicClient } from 'viem'

import { Network } from '~types/network.interface'
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface'

import { JibswapFactory__factory, JibswapPair__factory } from './viem'

type ContractOpts = { address: string; network: Network }

@Injectable()
export class JibswapViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) { }

  jibswapFactory({ address, network }: ContractOpts) {
    return JibswapFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network))
  }

  jibswapPair({ address, network }: ContractOpts) {
    return JibswapPair__factory.connect(address, this.appToolkit.getViemNetworkProvider(network))
  }
}
