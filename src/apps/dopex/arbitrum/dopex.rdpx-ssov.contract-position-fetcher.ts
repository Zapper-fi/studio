import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { DOPEX_DEFINITION } from '../dopex.definition';
import { DopexSsovContractPositionHelper } from '../helpers/dopex.ssov.contract-position-helper';

const appId = DOPEX_DEFINITION.id;
const groupId = DOPEX_DEFINITION.groups.rdpxSsov.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumDopexRdpxSsovContractPositionFetcher implements PositionFetcher<ContractPosition> {
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
        // rDPX; December Epoch (Legacy)
        {
          address: '0xfe351e85eb6b4292088dc28b66e9e92ab62fb663',
          depositTokenAddress: '0x32eb7902d4134bf98a28b963d26de779af92a212',
          extraRewardTokenAddresses: ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55'],
        },
        // rDPX; January Epoch (Legacy)
        {
          address: '0xd4cafe592be189aeb7826ee5062b29405ee63488',
          depositTokenAddress: '0x32eb7902d4134bf98a28b963d26de779af92a212',
          extraRewardTokenAddresses: ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55'],
        },
        // rDPX; February Epoch (Active)
        {
          address: '0x0393352c7c28903e7deaa5508f01cc89f25bcb5c',
          depositTokenAddress: '0x32eb7902d4134bf98a28b963d26de779af92a212',
          extraRewardTokenAddresses: ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55'],
        },
      ],
    });
  }
}
