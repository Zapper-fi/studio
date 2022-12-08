import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetPriceParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { IdleContractFactory, IdleToken } from '../contracts';

export type IdleVaultTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class EthereumIdleVaultTokenFetcher extends AppTokenTemplatePositionFetcher<
  IdleToken,
  DefaultAppTokenDataProps,
  IdleVaultTokenDefinition
> {
  groupLabel = 'Vault';
  isExcludedFromBalances = true;
  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(IdleContractFactory) protected readonly contractFactory: IdleContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): IdleToken {
    return this.contractFactory.idleToken({ network: this.network, address });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<IdleVaultTokenDefinition[]> {
    const controller = this.contractFactory.idleController({
      address: '0x275da8e61ea8e02d51edd8d0dc5c0e62b4cdb0be',
      network: this.network,
    });
    const marketTokenAddresses = await multicall.wrap(controller).getAllMarkets();

    const definitions = await Promise.all(
      marketTokenAddresses.map(async address => {
        const idleTokenContract = this.contractFactory.idleToken({ address, network: this.network });
        const underlyingTokenAddressRaw = await multicall.wrap(idleTokenContract).token();

        return {
          address,
          underlyingTokenAddress: underlyingTokenAddressRaw.toLowerCase(),
        };
      }),
    );

    return definitions;
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenAddresses({ definition }: GetUnderlyingTokensParams<IdleToken, IdleVaultTokenDefinition>) {
    return definition.underlyingTokenAddress;
  }

  async getPrice({ appToken, contract }: GetPriceParams<IdleToken>): Promise<number> {
    const priceRaw = await contract.tokenPrice();
    return Number(priceRaw) / 10 ** appToken.tokens[0].decimals;
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<IdleToken>) {
    const priceRaw = await contract.tokenPrice();
    const price = Number(priceRaw) / 10 ** appToken.tokens[0].decimals;

    return price / appToken.tokens[0].price;
  }

  async getApy({ contract }: GetDataPropsParams<IdleToken>): Promise<number> {
    const apyRaw = await contract.getAvgAPR();
    return Number(apyRaw) / 10 ** 18 / 100;
  }
}
