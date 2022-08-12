import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { DOPEX_DEFINITION } from '../dopex.definition';
import { DopexSsovContractPositionHelper } from '../helpers/dopex.ssov.contract-position-helper';

const appId = DOPEX_DEFINITION.id;
const groupId = DOPEX_DEFINITION.groups.gohmSsov.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumDopexGOhmSsovContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(DopexSsovContractPositionHelper)
    private readonly dopexSsovContractPositionHelper: DopexSsovContractPositionHelper,
  ) {}

  async getPositions() {
    return this.dopexSsovContractPositionHelper.getPositions({
      network,
      appId,
      groupId,
      definitions: [
        // gOHM December Epoch (Legacy)
        {
          address: '0x89836d5f178141aaf013412b12abd754802d2318',
          depositTokenAddress: '0x8d9ba570d6cb60c7e3e0f31343efe75ab8e65fb1',
        },
        // gOHM January Epoch (Legacy)
        {
          address: '0x460f95323a32e26c8d32346abe73eb94d7db08d6',
          depositTokenAddress: '0x8d9ba570d6cb60c7e3e0f31343efe75ab8e65fb1',
        },
        // gOHM February Epoch (Active)
        {
          address: '0x54552cb564f4675bceda644e47de3e35d1c88e1b',
          depositTokenAddress: '0x8d9ba570d6cb60c7e3e0f31343efe75ab8e65fb1',
        },
      ],
    });
  }
}
