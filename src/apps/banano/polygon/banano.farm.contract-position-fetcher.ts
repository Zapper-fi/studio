import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BANANO_DEFINITION } from '../banano.definition';
import { BananoFarmContractPositionFetcherHelper } from '../helpers/banano.farm.contract-position-fetcher-helper';

const appId = BANANO_DEFINITION.id;
const groupId = BANANO_DEFINITION.groups.farm.id;
const network = Network.POLYGON_MAINNET;

const BENIS = '0xefa4aED9Cf41A8A0FcdA4e88EfA2F60675bAeC9F';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonBananoFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(BananoFarmContractPositionFetcherHelper) private readonly helper: BananoFarmContractPositionFetcherHelper,
  ) {}

  async getPositions() {
    return this.helper.getPools(network, appId, groupId, BENIS, [{ appId: 'sushiswap', groupIds: ['pool'], network }]);
  }
}
