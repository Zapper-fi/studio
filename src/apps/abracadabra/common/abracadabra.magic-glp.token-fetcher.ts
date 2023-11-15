import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { Erc4626 } from '~contract/contracts/viem';
import { isAppToken } from '~position/position.interface';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetDataPropsParams,
  GetDisplayPropsParams,
  UnderlyingTokenDefinition,
} from '~position/template/app-token.template.types';
import { Erc4626VaultTemplateTokenFetcher } from '~position/template/erc4626-vault.template.token-fetcher';

import { AbracadabraViemContractFactory } from '../contracts';

const SECONDS_PER_YEAR = 31536000;
const BASIS_POINTS_DIVISOR = 10000;

export abstract class AbracadabraMagicGlpTokenFetcher extends Erc4626VaultTemplateTokenFetcher {
  groupLabel = 'Magic GLP';
  abstract glpTokenAddress: string;
  abstract get rewardTrackerAddresses(): string[] | Promise<string>[];
  abstract get magicGlpHarvestorAddress(): string | Promise<string>;
  abstract get magicGlpAnnualHarvests(): number | Promise<number>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraViemContractFactory) protected readonly contractFactory: AbracadabraViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getUnderlyingTokenDefinitions(): Promise<UnderlyingTokenDefinition[]> {
    // Override as the underlying is sGLP, but users expect to see GLP
    return [{ address: this.glpTokenAddress, network: this.network }];
  }

  async getLabel({ contract }: GetDisplayPropsParams<Erc4626>): Promise<string> {
    return contract.read.name();
  }

  async getImages({
    appToken,
  }: GetDisplayPropsParams<Erc4626, DefaultAppTokenDataProps, DefaultAppTokenDefinition>): Promise<string[]> {
    return [getTokenImg(appToken.address, this.network)];
  }

  async getApy({
    multicall,
    appToken,
    tokenLoader,
  }: GetDataPropsParams<Erc4626, DefaultAppTokenDataProps, DefaultAppTokenDefinition>): Promise<number> {
    const [magicGlpHarvestorAddress, magicGlpAnnualHarvests, rewardTrackerAddresses] = await Promise.all([
      this.magicGlpHarvestorAddress,
      this.magicGlpAnnualHarvests,
      Promise.all(this.rewardTrackerAddresses),
    ]);
    const magicGlpHarvestor = multicall.wrap(
      this.contractFactory.abracadabraMagicGlpHarvestor({
        address: magicGlpHarvestorAddress,
        network: this.network,
      }),
    );
    const rewardTrackers = rewardTrackerAddresses.map(rewardTrackerAddress =>
      multicall.wrap(
        this.contractFactory.gmxRewardTracker({
          address: rewardTrackerAddress,
          network: this.network,
        }),
      ),
    );

    const [magicGlpFeeProcent, annualUsdRewards] = await Promise.all([
      magicGlpHarvestor.read.feePercentBips().then(magicGlpFeeProcent => magicGlpFeeProcent / BASIS_POINTS_DIVISOR),
      Promise.all(
        rewardTrackers.map(async tracker => {
          const [tokensPerInterval, rewardToken] = await Promise.all([
            tracker.read.tokensPerInterval(),
            tracker.read.rewardToken().then(rewardTokenAddress =>
              tokenLoader.getOne({
                network: this.network,
                address: rewardTokenAddress,
              }),
            ),
          ]);

          if (rewardToken == null) {
            return 0;
          } else {
            const tokensPerYearRaw = BigNumber.from(tokensPerInterval).mul(SECONDS_PER_YEAR);
            const tokensPerYear = Number(tokensPerYearRaw) / 10 ** rewardToken.decimals;
            return tokensPerYear * rewardToken.price;
          }
        }),
      ),
    ]);

    const glp = appToken.tokens[0];
    const glpSupplyUsd = isAppToken(glp) ? glp.supply * glp.price : null;
    if (glpSupplyUsd == null || glpSupplyUsd <= 0) {
      return 0;
    } else {
      const apr = annualUsdRewards.map(annualUsdReward => annualUsdReward / glpSupplyUsd).reduce((a, b) => a + b, 0);
      const apy = Math.pow(1 + apr / magicGlpAnnualHarvests, magicGlpAnnualHarvests) - 1;
      const apyWithFees = apy * (1 - magicGlpFeeProcent);
      return apyWithFees * 100;
    }
  }
}
