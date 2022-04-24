import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition, ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AirswapContractFactory } from '../contracts';
import { AIRSWAP_DEFINITION } from '../airswap.definition';

const appId = AIRSWAP_DEFINITION.id;
const groupId = AIRSWAP_DEFINITION.groups.sAST.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAirswapSAstTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AirswapContractFactory) private readonly airswapContractFactory: AirswapContractFactory,
  ) {}

  async getPositions() {
    const address = '0x579120871266ccd8De6c85EF59E2fF6743E7CD15';

    // How to get user account?
    const account = '0xfd72d3071e1056aad6d076518c483200d2f9ad65';

    const contract = this.airswapContractFactory.staking({ address, network });
    const balance = await contract.balanceOf(account);

    return [balance];
  }
}
