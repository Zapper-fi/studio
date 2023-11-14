import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { IndexCoopViemContractFactory } from '../contracts';
import { IndexCoopToken } from '../contracts/viem';

@PositionTemplate()
export class EthereumIndexCoopIndexTokenFetcher extends AppTokenTemplatePositionFetcher<IndexCoopToken> {
  groupLabel = 'Index';

  deprecatedProducts = [
    '0x33d63ba1e57e54779f7ddaeaa7109349344cf5f1', // DATA
    '0x47110d43175f7f2c2425e7d15792acc5817eb44f', // GMI
  ];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(IndexCoopViemContractFactory) protected readonly contractFactory: IndexCoopViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.indexCoopToken({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return [
      '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b', // DPI
      '0x72e364f2abdc788b7e918bc238b21f109cd634d7', // MVI
      '0x2af1df3ab0ab157e1e2ad8f88a7d04fbea0c7dc6', // BED
      '0x7c07f7abe10ce8e33dc6c5ad68fe033085256a84', // icETH
      '0xaa6e8127831c9de45ae56bb1b0d4d4da6e5665bd', // ETH x2 Flex Leverage
      '0x0b498ff89709d3838a063f1dfa463091f9801c2b', // BTC x2 Flex Leverage
      '0x341c05c0e9b33c0e38d64de76516b2ce970bb3be', // DSETH
      '0xc30fba978743a43e736fc32fbeed364b8a2039cd', // Money Market Index
      '0x1b5e16c5b20fb5ee87c61fe9afe735cca3b21a65', // ic21
      '0x55b2cfcfe99110c773f00b023560dd9ef6c8a13b', // cdETI
      ...this.deprecatedProducts,
    ];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<IndexCoopToken>) {
    return (await contract.read.getComponents()).map(address => ({ address, network: this.network }));
  }

  async getPricePerShare({ appToken, contract }: GetDataPropsParams<IndexCoopToken>) {
    const pricePerShare = await Promise.all(
      appToken.tokens.map(async underlyingToken => {
        const ratio = await contract.read.getTotalComponentRealUnits([underlyingToken.address]);
        return Number(ratio) / 10 ** underlyingToken.decimals;
      }),
    );

    return pricePerShare;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<IndexCoopToken>) {
    const deprecated = this.deprecatedProducts.includes(appToken.address);
    return `${appToken.symbol}${deprecated === true ? ' (deprecated)' : ''}`;
  }
}
