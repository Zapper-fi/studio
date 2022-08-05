import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { DOPEX_DEFINITION } from '../dopex.definition';
import { DopexSsovContractPositionHelper } from '../helpers/dopex.ssov.contract-position-helper';

const appId = DOPEX_DEFINITION.id;
const groupId = DOPEX_DEFINITION.groups.ethSsov.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumDopexEthSsovContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(DopexSsovContractPositionHelper)
    private readonly dopexSsovContractPositionHelper: DopexSsovContractPositionHelper,
  ) {}

  async getPositions() {
    return this.dopexSsovContractPositionHelper.getPositions({
      network,
      appId,
      groupId: DOPEX_DEFINITION.groups.ethSsov.id,
      definitions: [
        // ETH December Epoch (Legacy)
        {
          address: '0x3154b747c4bfd35c67607d860b884d28f32ed00f',
          depositTokenAddress: '0x0000000000000000000000000000000000000000',
          extraRewardTokenAddresses: [
            '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
            '0x32eb7902d4134bf98a28b963d26de779af92a212',
          ],
        },
        // ETH January Epoch (Legacy)
        {
          address: '0x711da677a0d61ee855dad4241b552a706f529c70',
          depositTokenAddress: '0x0000000000000000000000000000000000000000',
          extraRewardTokenAddresses: [
            '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
            '0x32eb7902d4134bf98a28b963d26de779af92a212',
          ],
        },
        // ETH February Epoch (Active)
        {
          address: '0x2c9c1e9b4bdf6bf9cb59c77e0e8c0892ce3a9d5f',
          depositTokenAddress: '0x0000000000000000000000000000000000000000',
          extraRewardTokenAddresses: [
            '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
            '0x32eb7902d4134bf98a28b963d26de779af92a212',
          ],
        },
      ],
    });
  }
}
