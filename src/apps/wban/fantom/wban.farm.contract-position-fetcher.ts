import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { WbanFarmContractPositionFetcherHelper } from '../helpers/wban.farm.contract-position-fetcher-helper';
import { WBAN_DEFINITION } from '../wban.definition';

const appId = WBAN_DEFINITION.id;
const groupId = WBAN_DEFINITION.groups.farm.id;
const network = Network.FANTOM_OPERA_MAINNET;

const BENIS = '0xD91f84D4E2d9f4fa508c61356A6CB81a306e5287';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class FantomWbanFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(WbanFarmContractPositionFetcherHelper) private readonly helper: WbanFarmContractPositionFetcherHelper,
  ) {}

  async getPositions() {
    return this.helper.getPools(network, appId, groupId, BENIS, [{ appId: 'spookyswap', groupIds: ['pool'], network }]);
  }
}
