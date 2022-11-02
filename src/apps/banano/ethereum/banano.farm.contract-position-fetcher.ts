import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BANANO_DEFINITION } from '../banano.definition';
import { BananoFarmContractPositionFetcherHelper } from '../helpers/banano.farm.contract-position-fetcher-helper';

const appId = BANANO_DEFINITION.id;
const groupId = BANANO_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

const BENIS = '0xD91f84D4E2d9f4fa508c61356A6CB81a306e5287';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumBananoFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(BananoFarmContractPositionFetcherHelper) private readonly helper: BananoFarmContractPositionFetcherHelper,
  ) {}

  async getPositions() {
    return this.helper.getPools(network, appId, groupId, BENIS, [{ appId: 'uniswap-v2', groupIds: ['pool'], network }]);
  }
}
