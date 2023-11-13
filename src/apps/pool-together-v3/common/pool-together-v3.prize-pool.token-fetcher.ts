import { Inject } from '@nestjs/common';
import { Contract } from 'ethers';
import { compact, sum } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetUnderlyingTokensParams,
  GetDataPropsParams,
} from '~position/template/app-token.template.types';

import { PoolTogetherV3ViemContractFactory } from '../contracts';
import { Abi } from 'viem';

export type PoolTogetherV3PrizePoolDefinition = DefaultAppTokenDefinition & {
  ticketAddress: string;
  sponsorshipAddress: string;
  underlyingTokenAddress: string;
  tokenFaucets: {
    tokenFaucetAddress: string;
    assetAddress: string;
    measureAddress: string;
  }[];
};

export type PoolTogetherV3PrizePoolDataProps = DefaultAppTokenDataProps & {
  faucetAddresses: string[];
};

export abstract class PoolTogetherV3PrizePoolTokenFetcher<T extends Abi> extends AppTokenTemplatePositionFetcher<
  T,
  PoolTogetherV3PrizePoolDataProps,
  PoolTogetherV3PrizePoolDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV3ViemContractFactory) protected readonly contractFactory: PoolTogetherV3ViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getAddresses({ definitions }: GetAddressesParams<PoolTogetherV3PrizePoolDefinition>): Promise<string[]> {
    return definitions.map(({ address }) => address);
  }

  abstract getDefinitions(): Promise<PoolTogetherV3PrizePoolDefinition[]>;

  async getUnderlyingTokenDefinitions({ definition }: GetUnderlyingTokensParams<T, PoolTogetherV3PrizePoolDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getApy({
    definition,
    multicall,
    tokenLoader,
    appToken,
  }: GetDataPropsParams<T, PoolTogetherV3PrizePoolDataProps, PoolTogetherV3PrizePoolDefinition>) {
    const { tokenFaucets, sponsorshipAddress, ticketAddress } = definition;

    const sponsorshipTokenContract = this.appToolkit.globalViemContracts.erc20({
      address: sponsorshipAddress,
      network: this.network,
    });

    const ticketTokenContract = this.appToolkit.globalViemContracts.erc20({
      address: ticketAddress,
      network: this.network,
    });

    const [sponsorshipSupplyRaw, sponsorshipDecimals, ticketSupplyRaw, ticketDecimals] = await Promise.all([
      sponsorshipTokenContract.read.totalSupply(),
      sponsorshipTokenContract.read.decimals(),
      ticketTokenContract.read.totalSupply(),
      ticketTokenContract.read.decimals(),
    ]);

    const sponsorshipSupply = Number(sponsorshipSupplyRaw) / 10 ** sponsorshipDecimals;
    const ticketSupply = Number(ticketSupplyRaw) / 10 ** ticketDecimals;
    const totalSupply = sponsorshipSupply + ticketSupply;
    const totalLiquidity = totalSupply * appToken.tokens[0].price;

    const apys = await Promise.all(
      tokenFaucets.map(async tokenFaucet => {
        const { tokenFaucetAddress, assetAddress } = tokenFaucet;
        if (!tokenFaucetAddress || !assetAddress) return 0;

        const tokenFaucetContract = this.contractFactory.poolTogetherV3TokenFaucet({
          address: tokenFaucetAddress,
          network: this.network,
        });
        const assetContract = this.appToolkit.globalViemContracts.erc20({
          address: assetAddress,
          network: this.network,
        });

        const [_dripRatePerSecond, totalUnclaimed, faucetBalance, decimals, tokenDependency] = await Promise.all([
          multicall.wrap(tokenFaucetContract).read.dripRatePerSecond(),
          multicall.wrap(tokenFaucetContract).read.totalUnclaimed(),
          multicall.wrap(assetContract).read.balanceOf([tokenFaucetAddress]),
          multicall.wrap(assetContract).read.decimals(),
          tokenLoader.getOne({ address: assetAddress, network: this.network }),
        ]);
        const dripRatePerSecond = Number(_dripRatePerSecond) / 10 ** decimals;
        const remainingAssetTokens = Number(faucetBalance) / 10 ** decimals - Number(totalUnclaimed) / 10 ** decimals;
        const remainingSeconds = remainingAssetTokens / dripRatePerSecond;

        if (remainingSeconds <= 0) return 0;

        const totalDripPerDay = dripRatePerSecond * 86400;
        const rewardTokenPrice = tokenDependency?.price ?? 0;

        const totalDripDailyValue = totalDripPerDay * rewardTokenPrice;
        return (totalDripDailyValue / totalLiquidity) * 365;
      }),
    );

    return sum(apys);
  }

  async getDataProps(
    params: GetDataPropsParams<T, PoolTogetherV3PrizePoolDataProps, PoolTogetherV3PrizePoolDefinition>,
  ) {
    const defaultDataProps = await super.getDataProps(params);
    const { tokenFaucets } = params.definition;
    const faucetAddresses = compact(tokenFaucets.map(tokenFaucet => tokenFaucet.tokenFaucetAddress));
    return { ...defaultDataProps, faucetAddresses };
  }
}
