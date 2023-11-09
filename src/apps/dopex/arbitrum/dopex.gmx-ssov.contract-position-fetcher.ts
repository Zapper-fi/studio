import { BigNumberish } from 'ethers';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { DopexSsovContractPositionFetcher, DopexSsovDataProps } from '../common/dopex.ssov.contract-position-fetcher';
import { DopexGmxSsov } from '../contracts';

@PositionTemplate()
export class ArbitrumDopexGmxSsovContractPositionFetcher extends DopexSsovContractPositionFetcher<DopexGmxSsov> {
  groupLabel = 'SSOVs';

  getContract(address: string) {
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
  }: GetTokenBalancesParams<DopexGmxSsov, DopexSsovDataProps>) {
    const { epoch, strike } = contractPosition.dataProps;
    return contract.read.totalEpochStrikeGmxBalance([epoch, strike]);
  }

  async getTotalEpochStrikeRewardBalances({
    contract,
    contractPosition,
  }: GetTokenBalancesParams<DopexGmxSsov, DopexSsovDataProps>): Promise<BigNumberish | BigNumberish[]> {
    const { epoch, strike } = contractPosition.dataProps;
    const [claimedFees, totalEpochStrikeDeposits, totalEpochDeposits] = await Promise.all([
      contract.read.totalGmxFeesClaimed([strike]),
      contract.read.totalEpochStrikeDeposits([epoch, strike]),
      contract.read.totalEpochDeposits([epoch]),
    ]);

    const totalFeesClaimableForStrike =
      (Number(claimedFees) * Number(totalEpochStrikeDeposits)) / Number(totalEpochDeposits);
    return totalFeesClaimableForStrike.toFixed(0);
  }
}
