import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { Erc20 } from '~contract/contracts';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetDataPropsParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';
import { Erc4626VaultTemplateTokenFetcher } from '~position/template/erc4626-vault.template.token-fetcher';

import { AbracadabraContractFactory } from '../contracts';

const BASIS_POINTS_DIVISOR = 10000;

export abstract class AbracadabraMagicApeTokenFetcher extends Erc4626VaultTemplateTokenFetcher {
  groupLabel = 'Magic APE';

  abstract get magicApeAnnualHarvests(): number | Promise<number>;
  abstract get magicApeLensAddress(): string | Promise<string>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraContractFactory) protected readonly contractFactory: AbracadabraContractFactory,
  ) {
    super(appToolkit);
  }

  async getLabel({ contract }: GetDisplayPropsParams<Erc20>): Promise<string> {
    return contract.name();
  }

  async getImages({
    appToken,
  }: GetDisplayPropsParams<Erc20, DefaultAppTokenDataProps, DefaultAppTokenDefinition>): Promise<string[]> {
    return [getTokenImg(appToken.address, this.network)];
  }

  async getApy({
    multicall,
    appToken,
  }: GetDataPropsParams<Erc20, DefaultAppTokenDataProps, DefaultAppTokenDefinition>): Promise<number> {
    const [magicApeLensAddress, magicApeAnnualHarvests] = await Promise.all([
      this.magicApeLensAddress,
      this.magicApeAnnualHarvests,
    ]);
    const magicApe = multicall.wrap(
      this.contractFactory.abracadabraMagicApe({
        address: appToken.address,
        network: this.network,
      }),
    );
    const magicApeLens = multicall.wrap(
      this.contractFactory.abracadabraMagicApeLens({
        address: magicApeLensAddress,
        network: this.network,
      }),
    );

    const [feePercent, apr] = await Promise.all([
      magicApe.feePercentBips().then(feeBips => feeBips / BASIS_POINTS_DIVISOR),
      magicApeLens.getApeCoinInfo().then(apeCoinInfo => Number(apeCoinInfo.apr) / BASIS_POINTS_DIVISOR),
    ]);

    const apy = Math.pow(1 + apr / magicApeAnnualHarvests, magicApeAnnualHarvests) - 1;
    const apyWithFees = apy * (1 - feePercent);
    return apyWithFees * 100;
  }
}
