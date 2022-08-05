import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { DOPEX_DEFINITION } from '../dopex.definition';
import { DopexSsovContractPositionHelper } from '../helpers/dopex.ssov.contract-position-helper';

const appId = DOPEX_DEFINITION.id;
const groupId = DOPEX_DEFINITION.groups.dpxSsov.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumDopexDpxSsovContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(DopexSsovContractPositionHelper)
    private readonly dopexSsovContractPositionHelper: DopexSsovContractPositionHelper,
  ) {}

  async getPositions() {
    return this.dopexSsovContractPositionHelper.getPositions({
      network,
      appId,
      groupId: DOPEX_DEFINITION.groups.dpxSsov.id,
      definitions: [
        // DPX; December Epoch (Legacy)
        {
          address: '0x0359b4dcd2412ff0dafa8b020bcb57aa8bd13a33',
          depositTokenAddress: '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
          extraRewardTokenAddresses: ['0x32eb7902d4134bf98a28b963d26de779af92a212'],
        },
        // DPX; January Epoch (Legacy)
        {
          address: '0x48252edbfcc8a27390827950ccfc1c00152894e3',
          depositTokenAddress: '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
          extraRewardTokenAddresses: ['0x32eb7902d4134bf98a28b963d26de779af92a212'],
        },
        // DPX; February Epoch (Active)
        {
          address: '0xbb741dc1a519995eac67ec1f2bfeecbe5c02f46e',
          depositTokenAddress: '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
          extraRewardTokenAddresses: ['0x32eb7902d4134bf98a28b963d26de779af92a212'],
        },
      ],
    });
  }
}
