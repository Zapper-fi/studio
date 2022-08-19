import { BigNumberish } from 'ethers';
import { padEnd } from 'lodash';
import Web3 from 'web3';

import { Register } from '~app-toolkit/decorators';
import { GetTokenBalancesPerPositionParams } from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types/network.interface';

import { DopexSsovContractPositionFetcher, DopexSsovDataProps } from '../common/dopex.ssov.contract-position-fetcher';
import { DopexEthSsov } from '../contracts';
import { DOPEX_DEFINITION } from '../dopex.definition';

const appId = DOPEX_DEFINITION.id;
const groupId = DOPEX_DEFINITION.groups.ethSsov.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumDopexEthSsovContractPositionFetcher extends DopexSsovContractPositionFetcher<DopexEthSsov> {
  appId = appId;
  groupId = groupId;
  network = network;

  getContract(address: string): DopexEthSsov {
    return this.contractFactory.dopexEthSsov({ address, network: this.network });
  }

  getSsovDefinitions() {
    return [
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
    ];
  }

  getTotalEpochStrikeDepositBalance({
    contract,
    contractPosition,
  }: GetTokenBalancesPerPositionParams<DopexEthSsov, DopexSsovDataProps>) {
    const { epoch, strike } = contractPosition.dataProps;
    return contract.totalEpochStrikeEthBalance(epoch, strike);
  }

  async getTotalEpochStrikeRewardBalances({
    contract,
    contractPosition,
    multicall,
  }: GetTokenBalancesPerPositionParams<DopexEthSsov, DopexSsovDataProps>): Promise<BigNumberish | BigNumberish[]> {
    const { epoch } = contractPosition.dataProps;
    const rewardDistributionName = padEnd(Web3.utils.asciiToHex('RewardsDistribution'), 66, '0');
    const rewardDistrbutionAddress = await multicall.wrap(contract).getAddress(rewardDistributionName);
    const rewardDistributionContract = this.contractFactory.dopexRewardDistribution({
      address: rewardDistrbutionAddress,
      network: this.network,
    });

    return Promise.all([
      multicall.wrap(rewardDistributionContract).dpxReceived(epoch),
      multicall.wrap(rewardDistributionContract).rdpxReceived(epoch),
    ]);
  }
}
