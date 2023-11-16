import { BigNumberish } from 'ethers';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { DopexSsovContractPositionFetcher, DopexSsovDataProps } from '../common/dopex.ssov.contract-position-fetcher';
import { DopexRdpxSsov } from '../contracts/viem';

@PositionTemplate()
export class ArbitrumDopexRdpxSsovContractPositionFetcher extends DopexSsovContractPositionFetcher<DopexRdpxSsov> {
  groupLabel = 'SSOVs';

  getContract(address: string) {
    return this.contractFactory.dopexRdpxSsov({ address, network: this.network });
  }

  getSsovDefinitions() {
    return [
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
    ];
  }

  getTotalEpochStrikeDepositBalance({
    contract,
    contractPosition,
  }: GetTokenBalancesParams<DopexRdpxSsov, DopexSsovDataProps>) {
    const { epoch, strike } = contractPosition.dataProps;
    return contract.read.totalEpochStrikeBalance([BigInt(epoch), BigInt(strike)]);
  }

  getTotalEpochStrikeRewardBalances({
    contract,
    contractPosition,
  }: GetTokenBalancesParams<DopexRdpxSsov, DopexSsovDataProps>): Promise<BigNumberish | BigNumberish[]> {
    const { epoch, strike } = contractPosition.dataProps;
    return contract.read.totalEpochStrikeDpxBalance([BigInt(epoch), BigInt(strike)]);
  }
}
