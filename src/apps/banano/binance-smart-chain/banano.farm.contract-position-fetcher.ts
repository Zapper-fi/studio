import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BANANO_DEFINITION } from '../banano.definition';
import { BananoFarmContractPositionFetcherHelper } from '../helpers/banano.farm.contract-position-fetcher-helper';

const appId = BANANO_DEFINITION.id;
const groupId = BANANO_DEFINITION.groups.farm.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

const BENIS = '0x1E30E12e82956540bf870A40FD1215fC083a3751';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainBananoFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(BananoFarmContractPositionFetcherHelper) private readonly helper: BananoFarmContractPositionFetcherHelper,
  ) {}

  async getPositions() {
    return this.helper.getPools(network, appId, groupId, BENIS, [
      { appId: 'apeswap', groupIds: ['pool'], network },
      { appId: 'pancakeswap', groupIds: ['pool'], network },
    ]);
  }
}
