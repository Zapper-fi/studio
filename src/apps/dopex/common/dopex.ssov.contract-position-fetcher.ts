import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumberish, Contract, ethers } from 'ethers';
import { isArray, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractPosition, MetaType } from '~position/position.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import {
  ContractPositionTemplatePositionFetcher,
  DataPropsStageParams,
  DescriptorsStageParams,
  DisplayPropsStageParams,
  GetTokenBalancesPerPositionParams,
  TokenStageParams,
  UnderlyingTokenDescriptor,
} from '~position/template/contract-position.template.position-fetcher';

import { DopexContractFactory } from '../contracts';

export type DopexSsovDefinition = {
  address: string;
  depositTokenAddress: string;
  extraRewardTokenAddresses?: string[];
};

export type DopexSsovDataProps = {
  epoch: number;
  strike: number;
};

export type DopexSsovDescriptor = {
  address: string;
  depositTokenAddress: string;
  extraRewardTokenAddresses?: string[];
  strike: number;
  epoch: number;
};

export abstract class DopexSsovContractPositionFetcher<
  T extends Contract,
> extends ContractPositionTemplatePositionFetcher<T, DopexSsovDataProps, DopexSsovDescriptor> {
  abstract getSsovDefinitions(): DopexSsovDefinition[];
  abstract getTotalEpochStrikeDepositBalance(
    params: GetTokenBalancesPerPositionParams<T, DopexSsovDataProps>,
  ): Promise<BigNumberish>;
  abstract getTotalEpochStrikeRewardBalances(
    params: GetTokenBalancesPerPositionParams<T, DopexSsovDataProps>,
  ): Promise<BigNumberish | BigNumberish[]>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DopexContractFactory) protected readonly contractFactory: DopexContractFactory,
  ) {
    super(appToolkit);
  }

  async getDescriptors({ multicall }: DescriptorsStageParams) {
    const ssovDefinitions = this.getSsovDefinitions();

    const descriptorsBySsov = await Promise.all(
      ssovDefinitions.map(async ({ address, depositTokenAddress, extraRewardTokenAddresses }) => {
        const _contract = this.contractFactory.dopexDpxSsov({ address, network: this.network });
        const contract = multicall.wrap(_contract);
        const currentEpoch = Number(await contract.currentEpoch());

        const nextEpoch = currentEpoch + 1;
        const nextEpochStartTime = await contract.epochStartTimes(nextEpoch).then(Number);
        const lastValidEpoch = nextEpochStartTime > 0 ? nextEpoch : currentEpoch;

        const descriptors = await Promise.all(
          range(1, lastValidEpoch + 1).map(async epoch => {
            const strikes = await contract.getEpochStrikes(epoch);
            return strikes.map(strike => ({
              address,
              depositTokenAddress,
              extraRewardTokenAddresses,
              epoch,
              strike: Number(strike),
            }));
          }),
        );

        return descriptors.flat();
      }),
    );

    return descriptorsBySsov.flat();
  }

  async getDataProps({ descriptor }: DataPropsStageParams<T, DopexSsovDataProps, DopexSsovDescriptor>) {
    return { epoch: descriptor.epoch, strike: descriptor.strike };
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<T, DopexSsovDataProps>) {
    const depositToken = contractPosition.tokens.find(isSupplied)!;
    const { epoch, strike } = contractPosition.dataProps;
    const strikeLabel = Number(strike) / 10 ** 8; // Price in USDC
    return `${getLabelFromToken(depositToken)} SSOV - Epoch ${epoch}, Strike ${strikeLabel}`;
  }

  async getImages({ contractPosition }: DisplayPropsStageParams<T, DopexSsovDataProps>) {
    return contractPosition.tokens
      .filter(isSupplied)
      .map(v => getImagesFromToken(v))
      .flat();
  }

  async getTokenDescriptors({ descriptor }: TokenStageParams<T, DopexSsovDataProps, DopexSsovDescriptor>) {
    const tokens: UnderlyingTokenDescriptor[] = [];
    const { depositTokenAddress, extraRewardTokenAddresses = [] } = descriptor;
    tokens.push({ metaType: MetaType.SUPPLIED, address: depositTokenAddress });
    tokens.push(...extraRewardTokenAddresses.map(v => ({ metaType: MetaType.CLAIMABLE, address: v })));
    return tokens;
  }

  getKey({ contractPosition }: { contractPosition: ContractPosition<DopexSsovDataProps> }): string {
    return this.appToolkit.getPositionKey(contractPosition, ['epoch', 'strike']);
  }

  async getDepositBalance(params: GetTokenBalancesPerPositionParams<T, DopexSsovDataProps>) {
    const { address, contractPosition, contract } = params;
    const epoch = contractPosition.dataProps.epoch;
    const strike = contractPosition.dataProps.strike;

    const userStrike = ethers.utils.solidityKeccak256(['address', 'uint256'], [address, strike]);
    const [totalDepositBalanceRaw, userDepositBalanceRaw] = await Promise.all([
      contract.totalEpochStrikeDeposits(epoch, strike),
      contract.userEpochDeposits(epoch, userStrike),
    ]);

    const share = Number(userDepositBalanceRaw) / Number(totalDepositBalanceRaw) || 0;
    if (share === 0) return '0';

    // Resolve the final epoch strike balance; if 0, then simply use the deposits because the final PnL hasn't been tallied
    const finalBalanceRaw = await this.getTotalEpochStrikeDepositBalance(params);
    const realCurrentBalanceRaw = Number(finalBalanceRaw) === 0 ? totalDepositBalanceRaw : finalBalanceRaw;
    const balanceRaw = new BigNumber(realCurrentBalanceRaw.toString()).times(share).toFixed(0);

    return balanceRaw;
  }

  async getClaimableBalances(params: GetTokenBalancesPerPositionParams<T, DopexSsovDataProps>) {
    const { address, contractPosition, contract } = params;
    const claimableTokens = contractPosition.tokens.filter(isClaimable);
    const epoch = contractPosition.dataProps.epoch;
    const strike = contractPosition.dataProps.strike;

    const userStrike = ethers.utils.solidityKeccak256(['address', 'uint256'], [address, strike]);
    const [totalDepositBalanceRaw, userDepositBalanceRaw] = await Promise.all([
      contract.totalEpochStrikeDeposits(epoch, strike),
      contract.userEpochDeposits(epoch, userStrike),
    ]);

    const share = Number(userDepositBalanceRaw) / Number(totalDepositBalanceRaw) || 0;
    if (share === 0) return claimableTokens.map(() => '0');

    const currentBalancesRaw = await this.getTotalEpochStrikeRewardBalances(params);
    const currentBalancesRawArr = isArray(currentBalancesRaw) ? currentBalancesRaw : [currentBalancesRaw];
    return currentBalancesRawArr.map(v => new BigNumber(v.toString()).times(share).toFixed(0));
  }

  async getTokenBalancesPerPosition(params: GetTokenBalancesPerPositionParams<T, DopexSsovDataProps>) {
    const [depositBalance, claimableBalances] = await Promise.all([
      this.getDepositBalance(params),
      this.getClaimableBalances(params),
    ]);

    return [depositBalance, ...claimableBalances];
  }
}
