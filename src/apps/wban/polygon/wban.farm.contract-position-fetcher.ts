import { Inject } from '@nestjs/common';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';
import { WbanFarmContractPositionFetcherHelper } from '../helpers/wban.farm.contract-position-fetcher-helper';
import { WBAN_DEFINITION } from '../wban.definition';

const appId = WBAN_DEFINITION.id;
const groupId = WBAN_DEFINITION.groups.farm.id;
const network = Network.POLYGON_MAINNET;

const BENIS = '0xefa4aED9Cf41A8A0FcdA4e88EfA2F60675bAeC9F';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonWbanFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(WbanFarmContractPositionFetcherHelper) private readonly helper: WbanFarmContractPositionFetcherHelper) {}

  async getPositions() {
    return this.helper.getPools(network, appId, groupId, BENIS, [
      { appId: 'sushiswap', groupIds: ['pool'], network },
    ]);
  }
}
