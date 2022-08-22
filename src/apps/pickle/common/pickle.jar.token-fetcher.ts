import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import {
  AppTokenTemplatePositionFetcher,
  DataPropsStageParams,
  DisplayPropsStageParams,
  PricePerShareStageParams,
  UnderlyingTokensStageParams,
} from '~position/template/app-token.template.position-fetcher';

import { PickleContractFactory, PickleJar } from '../contracts';
import { PickleApiJarRegistry } from './pickle.api.jar-registry';

export type PickleJarDataProps = {
  apy: number;
  liquidity: number;
  reserve: number;
};

export abstract class PickleJarTokenFetcher extends AppTokenTemplatePositionFetcher<PickleJar, PickleJarDataProps> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PickleContractFactory) protected readonly contractFactory: PickleContractFactory,
    @Inject(PickleApiJarRegistry) protected readonly jarRegistry: PickleApiJarRegistry,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PickleJar {
    return this.contractFactory.pickleJar({ address, network: this.network });
  }

  async getAddresses() {
    const vaults = await this.jarRegistry.getJarDefinitions({ network: this.network });
    return vaults.map(v => v.vaultAddress);
  }

  async getUnderlyingTokenAddresses({ contract }: UnderlyingTokensStageParams<PickleJar>) {
    return contract.token();
  }

  async getPricePerShare({ contract }: PricePerShareStageParams<PickleJar, DefaultDataProps>): Promise<number> {
    return contract.getRatio().then(v => Number(v) / 10 ** 18);
  }

  async getDataProps({ contract, appToken }: DataPropsStageParams<PickleJar, PickleJarDataProps>) {
    const vaultDefinitions = await this.jarRegistry.getJarDefinitions({ network: this.network });
    const vaultDefinition = vaultDefinitions.find(v => v.vaultAddress === appToken.address);
    const apy = vaultDefinition?.apy ?? 0;

    const underlyingToken = appToken.tokens[0]!;
    const reserveRaw = await contract.balance();
    const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
    const liquidity = reserve * underlyingToken.price;
    return { apy, reserve, liquidity };
  }

  async getLabel({ appToken }: DisplayPropsStageParams<PickleJar, DefaultDataProps>) {
    return `${getLabelFromToken(appToken.tokens[0])} Jar`;
  }
}
