import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumberish, ethers } from 'ethers';
import { isArray, range } from 'lodash';
import { Abi } from 'viem';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { DopexViemContractFactory } from '../contracts';
import { DopexDpxSsovContract } from '../contracts/viem/DopexDpxSsov';

export type DopexSsovDefinition = {
  address: string;
  depositTokenAddress: string;
  extraRewardTokenAddresses?: string[];
};

export type DopexSsovDataProps = {
  epoch: number;
  strike: number;
  positionKey: string;
};

export type DopexSsovEpochStrikeDefinition = {
  address: string;
  depositTokenAddress: string;
  extraRewardTokenAddresses?: string[];
  strike: number;
  epoch: number;
};

export abstract class DopexSsovContractPositionFetcher<T extends Abi> extends ContractPositionTemplatePositionFetcher<
  T,
  DopexSsovDataProps,
  DopexSsovEpochStrikeDefinition
> {
  abstract getSsovDefinitions(): DopexSsovDefinition[];
  abstract getTotalEpochStrikeDepositBalance(
    params: GetTokenBalancesParams<T, DopexSsovDataProps>,
  ): Promise<BigNumberish>;
  abstract getTotalEpochStrikeRewardBalances(
    params: GetTokenBalancesParams<T, DopexSsovDataProps>,
  ): Promise<BigNumberish | BigNumberish[]>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DopexViemContractFactory) protected readonly contractFactory: DopexViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const ssovDefinitions = this.getSsovDefinitions();

    const definitionsBySsov = await Promise.all(
      ssovDefinitions.map(async ({ address, depositTokenAddress, extraRewardTokenAddresses }) => {
        const _contract = this.contractFactory.dopexDpxSsov({ address, network: this.network });
        const contract = multicall.wrap(_contract);
        const currentEpoch = Number(await contract.read.currentEpoch());

        const nextEpoch = currentEpoch + 1;
        const nextEpochStartTime = await contract.read.epochStartTimes([BigInt(nextEpoch)]).then(Number);
        const lastValidEpoch = nextEpochStartTime > 0 ? nextEpoch : currentEpoch;

        const definitions = await Promise.all(
          range(1, lastValidEpoch + 1).map(async epoch => {
            const strikes = await contract.read.getEpochStrikes([BigInt(epoch)]);
            return strikes.map(strike => ({
              address,
              depositTokenAddress,
              extraRewardTokenAddresses,
              epoch,
              strike: Number(strike),
            }));
          }),
        );

        return definitions.flat();
      }),
    );

    return definitionsBySsov.flat();
  }

  async getDataProps({ definition }: GetDataPropsParams<T, DopexSsovDataProps, DopexSsovEpochStrikeDefinition>) {
    return {
      epoch: definition.epoch,
      strike: definition.strike,
      positionKey: `${definition.epoch}:${definition.strike}`,
    };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<T, DopexSsovDataProps>) {
    const depositToken = contractPosition.tokens.find(isSupplied)!;
    const { epoch, strike } = contractPosition.dataProps;
    const strikeLabel = Number(strike) / 10 ** 8; // Price in USDC
    return `${getLabelFromToken(depositToken)} SSOV - Epoch ${epoch}, Strike ${strikeLabel}`;
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<T, DopexSsovDataProps>) {
    return contractPosition.tokens
      .filter(isSupplied)
      .map(v => getImagesFromToken(v))
      .flat();
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<T, DopexSsovEpochStrikeDefinition>) {
    const tokens: UnderlyingTokenDefinition[] = [];
    const { depositTokenAddress, extraRewardTokenAddresses = [] } = definition;
    tokens.push({ metaType: MetaType.SUPPLIED, address: depositTokenAddress, network: this.network });
    tokens.push(
      ...extraRewardTokenAddresses.map(v => ({ metaType: MetaType.CLAIMABLE, address: v, network: this.network })),
    );
    return tokens;
  }

  async getDepositBalance(params: GetTokenBalancesParams<T, DopexSsovDataProps>) {
    const { address, contractPosition, contract } = params;
    const epoch = contractPosition.dataProps.epoch;
    const strike = contractPosition.dataProps.strike;

    const userStrike = ethers.utils.solidityKeccak256(['address', 'uint256'], [address, strike]);
    const castContract = contract as any as DopexDpxSsovContract;

    const [totalDepositBalanceRaw, userDepositBalanceRaw] = await Promise.all([
      castContract.read.totalEpochStrikeDeposits([BigInt(epoch), BigInt(strike)]),
      castContract.read.userEpochDeposits([BigInt(epoch), userStrike]),
    ]);

    const share = Number(userDepositBalanceRaw) / Number(totalDepositBalanceRaw) || 0;
    if (share === 0) return '0';

    // Resolve the final epoch strike balance; if 0, then simply use the deposits because the final PnL hasn't been tallied
    const finalBalanceRaw = await this.getTotalEpochStrikeDepositBalance(params);
    const realCurrentBalanceRaw = Number(finalBalanceRaw) === 0 ? totalDepositBalanceRaw : finalBalanceRaw;
    const balanceRaw = new BigNumber(realCurrentBalanceRaw.toString()).times(share).toFixed(0);

    return balanceRaw;
  }

  async getClaimableBalances(params: GetTokenBalancesParams<T, DopexSsovDataProps>) {
    const { address, contractPosition, contract } = params;
    const claimableTokens = contractPosition.tokens.filter(isClaimable);
    const epoch = contractPosition.dataProps.epoch;
    const strike = contractPosition.dataProps.strike;

    const userStrike = ethers.utils.solidityKeccak256(['address', 'uint256'], [address, strike]);
    const castContract = contract as any as DopexDpxSsovContract;
    const [totalDepositBalanceRaw, userDepositBalanceRaw] = await Promise.all([
      castContract.read.totalEpochStrikeDeposits([BigInt(epoch), BigInt(strike)]),
      castContract.read.userEpochDeposits([BigInt(epoch), userStrike]),
    ]);

    const share = Number(userDepositBalanceRaw) / Number(totalDepositBalanceRaw) || 0;
    if (share === 0) return claimableTokens.map(() => '0');

    const currentBalancesRaw = await this.getTotalEpochStrikeRewardBalances(params);
    const currentBalancesRawArr = isArray(currentBalancesRaw) ? currentBalancesRaw : [currentBalancesRaw];
    return currentBalancesRawArr.map(v => new BigNumber(v.toString()).times(share).toFixed(0));
  }

  async getTokenBalancesPerPosition(params: GetTokenBalancesParams<T, DopexSsovDataProps>) {
    const [depositBalance, claimableBalances] = await Promise.all([
      this.getDepositBalance(params),
      this.getClaimableBalances(params),
    ]);

    return [depositBalance, ...claimableBalances];
  }
}
