import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { DOPEX_DEFINITION } from '../dopex.definition';
import { DopexSsovContractPositionHelper } from '../helpers/dopex.ssov.contract-position-helper';

const appId = DOPEX_DEFINITION.id;
const groupId = DOPEX_DEFINITION.groups.gmxSsov.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumDopexGmxSsovContractPositionFetcher implements PositionFetcher<ContractPosition> {
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
        // GMX January Epoch (Legacy)
        {
          address: '0x04996afcf40a14d0892b00c816874f9c1a52c93b',
          depositTokenAddress: '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a',
          extraRewardTokenAddresses: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1'],
        },
        // GMX February Epoch (Active)
        {
          address: '0x5be3c77ed3cd42fc2c702c9fcd665f515862b0ae',
          depositTokenAddress: '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a',
          extraRewardTokenAddresses: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1'],
        },
      ],
    });
  }
}
