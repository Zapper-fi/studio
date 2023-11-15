import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts/viem';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
} from '~position/template/app-token.template.types';

import { MetavaultTradeViemContractFactory } from '../contracts';

export type MetavaultTradeMvlpTokenDefinition = {
  address: string;
  vaultAddress: string;
  underlyingTokenAddresses: string[];
};

@PositionTemplate()
export class PolygonMetavaultTradeMvlpTokenFetcher extends AppTokenTemplatePositionFetcher<
  Erc20,
  DefaultAppTokenDataProps,
  MetavaultTradeMvlpTokenDefinition
> {
  groupLabel = 'MVLP';
  mvlpManagerAddress = '0x13e733ddd6725a8133bec31b2fc5994fa5c26ea9';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MetavaultTradeViemContractFactory) protected readonly contractFactory: MetavaultTradeViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.appToolkit.globalViemContracts.erc20({ network: this.network, address });
  }

  async getDefinitions(): Promise<MetavaultTradeMvlpTokenDefinition[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const mvlpManagerContract = this.contractFactory.metavaultTradeMvlpManager({
      address: this.mvlpManagerAddress,
      network: this.network,
    });
    const vaultAddressRaw = await multicall.wrap(mvlpManagerContract).read.vault();
    const vaultContract = this.contractFactory.metavaultTradeVault({
      address: vaultAddressRaw.toLowerCase(),
      network: this.network,
    });

    const numTokens = await multicall.wrap(vaultContract).read.allWhitelistedTokensLength();
    const underlyingTokenAddressesRaw = await Promise.all(
      range(0, Number(numTokens)).map(
        async i => await multicall.wrap(vaultContract).read.allWhitelistedTokens([BigInt(i)]),
      ),
    );
    return [
      {
        address: '0x9f4f8bc00f48663b7c204c96b932c29ccc43a2e8',
        vaultAddress: vaultAddressRaw.toLowerCase(),
        underlyingTokenAddresses: underlyingTokenAddressesRaw.map(x => x.toLowerCase()),
      },
    ];
  }

  async getAddresses({ definitions }: GetAddressesParams<DefaultAppTokenDefinition>) {
    return definitions.map(x => x.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<Erc20, MetavaultTradeMvlpTokenDefinition>): Promise<UnderlyingTokenDefinition[]> {
    return definition.underlyingTokenAddresses.map(address => {
      return { address, network: this.network };
    });
  }

  async getPricePerShare({
    appToken,
    definition,
    multicall,
  }: GetPricePerShareParams<Erc20, DefaultAppTokenDataProps, MetavaultTradeMvlpTokenDefinition>) {
    const reserves = await Promise.all(
      appToken.tokens.map(async token => {
        const underlyingTokenContract = this.appToolkit.globalViemContracts.erc20({
          address: token.address,
          network: this.network,
        });
        const reserveRaw = await multicall.wrap(underlyingTokenContract).read.balanceOf([definition.vaultAddress]);
        const reserve = Number(reserveRaw) / 10 ** token.decimals;
        return reserve;
      }),
    );

    return reserves.map(r => r / appToken.supply);
  }
}
