import { BigNumberish } from 'ethers';

import { Register } from '~app-toolkit/decorators';
import { GetTokenBalancesPerPositionParams } from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types/network.interface';

import { DopexSsovContractPositionFetcher, DopexSsovDataProps } from '../common/dopex.ssov.contract-position-fetcher';
import { DopexRdpxSsov } from '../contracts';
import { DOPEX_DEFINITION } from '../dopex.definition';

const appId = DOPEX_DEFINITION.id;
const groupId = DOPEX_DEFINITION.groups.rdpxSsov.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumDopexRdpxSsovContractPositionFetcher extends DopexSsovContractPositionFetcher<DopexRdpxSsov> {
  appId = appId;
  groupId = groupId;
  network = network;

  getContract(address: string): DopexRdpxSsov {
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
  }: GetTokenBalancesPerPositionParams<DopexRdpxSsov, DopexSsovDataProps>) {
    const { epoch, strike } = contractPosition.dataProps;
    return contract.totalEpochStrikeBalance(epoch, strike);
  }

  getTotalEpochStrikeRewardBalances({
    contract,
    contractPosition,
  }: GetTokenBalancesPerPositionParams<DopexRdpxSsov, DopexSsovDataProps>): Promise<BigNumberish | BigNumberish[]> {
    const { epoch, strike } = contractPosition.dataProps;
    return contract.totalEpochStrikeDpxBalance(epoch, strike);
  }
}
