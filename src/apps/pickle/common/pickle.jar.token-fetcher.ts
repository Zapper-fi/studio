import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { PickleContractFactory, PickleJar } from '../contracts';

import { PickleApiJarRegistry } from './pickle.api.jar-registry';

export abstract class PickleJarTokenFetcher extends AppTokenTemplatePositionFetcher<PickleJar> {
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

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<PickleJar>) {
    // If jar doesn't have the pool property, it's a "legacy" deposit token (e.g. UniV2 LP)
    try {
      const pool = await contract.pool();
      return pool;
    } catch {
      return contract.token();
    }
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<PickleJar, DefaultDataProps>): Promise<number> {
    return contract.getRatio().then(v => Number(v) / 10 ** 18);
  }

  async getLiquidity({ appToken, contract }: GetDataPropsParams<PickleJar>) {
    const reserveRaw = await contract.balance();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return reserve * appToken.tokens[0].price;
  }

  async getReserves({ appToken, contract }: GetDataPropsParams<PickleJar>) {
    const reserveRaw = await contract.balance();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve];
  }

  async getApy({ appToken }: GetDataPropsParams<PickleJar>) {
    const vaultDefinitions = await this.jarRegistry.getJarDefinitions({ network: this.network });
    const vaultDefinition = vaultDefinitions.find(v => v.vaultAddress === appToken.address);
    return vaultDefinition?.apy ?? 0;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<PickleJar, DefaultDataProps>) {
    return `${getLabelFromToken(appToken.tokens[0])} Jar`;
  }
}
