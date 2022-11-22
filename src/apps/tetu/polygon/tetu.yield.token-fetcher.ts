import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetDataPropsParams,
  GetPriceParams,
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { TetuContractFactory, TetuYieldVault } from '../contracts';

@PositionTemplate()
export class TetuYieldTokenFetcher extends AppTokenTemplatePositionFetcher<TetuYieldVault> {
  groupLabel = 'Yield';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TetuContractFactory) protected readonly contractFactory: TetuContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TetuYieldVault {
    return this.contractFactory.tetuYieldVault({ network: this.network, address });
  }

  async getAddresses({ multicall }: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    const bookkeeperContract = this.contractFactory.tetuBookkeeper({
      address: '0x0a0846c978a56d6ea9d2602eeb8f977b21f3207f',
      network: this.network,
    });
    const vaultAddressesRaw = await multicall.wrap(bookkeeperContract).vaults();
    const vaultAddresses = vaultAddressesRaw.map(x => x.toLowerCase());

    return vaultAddresses;
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<TetuYieldVault>) {
    return contract.underlying();
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<TetuYieldVault>) {
    const [pricePerShareRaw, decimals] = await Promise.all([contract.getPricePerFullShare(), contract.decimals()]);
    const pricePerShare = Number(pricePerShareRaw) / 10 ** decimals;

    return pricePerShare;
  }

  async getPrice({ appToken }: GetPriceParams<TetuYieldVault, DefaultDataProps>): Promise<number> {
    return appToken.tokens[0].price;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<TetuYieldVault>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<TetuYieldVault>) {
    return (appToken.pricePerShare as number[]).map(t => t * appToken.supply);
  }

  async getApy() {
    return 0;
  }
}
