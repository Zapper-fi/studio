import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { InsuraceContractFactory } from '../contracts';
import { getMiningPositions } from '../helpers';
import { INSURACE_DEFINITION } from '../insurace.definition';

const appId = INSURACE_DEFINITION.id;
const groupId = INSURACE_DEFINITION.groups.mining.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumInsuraceMiningTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(InsuraceContractFactory) private readonly insuraceContractFactory: InsuraceContractFactory,
  ) {}

  async getPositions() {
    return getMiningPositions(network, this.appToolkit, this.insuraceContractFactory);
  }
}
