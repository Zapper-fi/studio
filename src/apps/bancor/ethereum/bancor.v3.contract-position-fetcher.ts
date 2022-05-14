import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BANCOR_DEFINITION } from '../bancor.definition';
import { BancorContractFactory } from '../contracts';

const appId = BANCOR_DEFINITION.id;
const groupId = BANCOR_DEFINITION.groups.v3.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumBancorV3ContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BancorContractFactory) private readonly bancorContractFactory: BancorContractFactory,
  ) {}

  async getPositions() {
    return [];
  }
}
