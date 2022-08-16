import { BigNumberish } from 'ethers';

import { Register } from '~app-toolkit/decorators';
import { GetTokenBalancesPerPositionParams } from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types/network.interface';

import { DopexSsovContractPositionFetcher, DopexSsovDataProps } from '../common/dopex.ssov.contract-position-fetcher';
import { DopexGmxSsov } from '../contracts';
import { DOPEX_DEFINITION } from '../dopex.definition';

const appId = DOPEX_DEFINITION.id;
const groupId = DOPEX_DEFINITION.groups.gmxSsov.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumDopexGmxSsovContractPositionFetcher extends DopexSsovContractPositionFetcher<DopexGmxSsov> {
  appId = appId;
  groupId = groupId;
  network = network;

  getContract(address: string): DopexGmxSsov {
    return this.contractFactory.dopexGmxSsov({ address, network: this.network });
  }

  getSsovDefinitions() {
    return [
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
    ];
  }

  getTotalEpochStrikeDepositBalance({
    contract,
    contractPosition,
  }: GetTokenBalancesPerPositionParams<DopexGmxSsov, DopexSsovDataProps>) {
    const { epoch, strike } = contractPosition.dataProps;
    return contract.totalEpochStrikeGmxBalance(epoch, strike);
  }

  async getTotalEpochStrikeRewardBalances({
    contract,
    contractPosition,
  }: GetTokenBalancesPerPositionParams<DopexGmxSsov, DopexSsovDataProps>): Promise<BigNumberish | BigNumberish[]> {
    const { epoch, strike } = contractPosition.dataProps;
    const [claimedFees, totalEpochStrikeDeposits, totalEpochDeposits] = await Promise.all([
      contract.totalGmxFeesClaimed(strike),
      contract.totalEpochStrikeDeposits(epoch, strike),
      contract.totalEpochDeposits(epoch),
    ]);

    const totalFeesClaimableForStrike =
      (Number(claimedFees) * Number(totalEpochStrikeDeposits)) / Number(totalEpochDeposits);
    return totalFeesClaimableForStrike.toFixed(0);
  }
}
