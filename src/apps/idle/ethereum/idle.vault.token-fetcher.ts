import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { IdleContractFactory, IdleToken } from '../contracts';

@PositionTemplate()
export class EthereumIdleVaultTokenFetcher extends AppTokenTemplatePositionFetcher<IdleToken> {
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

  async getAddresses({ multicall }: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    const controller = this.contractFactory.idleController({
      address: '0x275da8e61ea8e02d51edd8d0dc5c0e62b4cdb0be',
      network: this.network,
    });

    const vaultTokens = await controller.getAllMarkets();
    const liveVaultTokens = await Promise.all(
      vaultTokens.map(async address => {
        const contract = this.contractFactory.idleToken({ network: this.network, address });
        const isPaused = await multicall.wrap(contract).paused();
        return isPaused ? null : address;
      }),
    );

    return compact(liveVaultTokens);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<IdleToken>) {
    return [{ address: await contract.token(), network: this.network }];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<IdleToken>) {
    const priceRaw = await contract.tokenPrice();
    const price = Number(priceRaw) / 10 ** appToken.tokens[0].decimals;

    return [price / appToken.tokens[0].price];
  }

  async getApy({ contract }: GetDataPropsParams<IdleToken>): Promise<number> {
    const apyRaw = await contract.getAvgAPR();
    return Number(apyRaw) / 10 ** 18 / 100;
  }
}
