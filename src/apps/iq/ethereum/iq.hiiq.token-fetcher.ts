import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { IqContractFactory } from '../contracts';
import { IQ_DEFINITION } from '../iq.definition';

const appId = IQ_DEFINITION.id;
const groupId = IQ_DEFINITION.groups.hiiq.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumIqHiiqTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(IqContractFactory) private readonly iqContractFactory: IqContractFactory,
  ) {}

  async getPositions() {
    return [];
  }
}
