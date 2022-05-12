import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CONCENTRATOR_DEFINITION } from '../concentrator.definition';
import { ConcentratorContractFactory } from '../contracts';

const appId = CONCENTRATOR_DEFINITION.id;
const groupId = CONCENTRATOR_DEFINITION.groups.concentrator.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumConcentratorConcentratorTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorContractFactory) private readonly concentratorContractFactory: ConcentratorContractFactory,
  ) { }

  async getPositions() {
    return [];
  }
}
