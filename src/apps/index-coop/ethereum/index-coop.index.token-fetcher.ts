import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPriceParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { IndexCoopContractFactory, IndexCoopToken } from '../contracts';

@PositionTemplate()
export class EthereumIndexCoopIndexTokenFetcher extends AppTokenTemplatePositionFetcher<IndexCoopToken> {
  groupLabel = 'Index';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(IndexCoopContractFactory) protected readonly contractFactory: IndexCoopContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): IndexCoopToken {
    return this.contractFactory.indexCoopToken({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return [
      '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b', // DPI
      '0x72e364f2abdc788b7e918bc238b21f109cd634d7', // MVI
      '0x33d63ba1e57e54779f7ddaeaa7109349344cf5f1', // DATA
      '0x2af1df3ab0ab157e1e2ad8f88a7d04fbea0c7dc6', // BED
      '0x47110d43175f7f2c2425e7d15792acc5817eb44f', // GMI
      '0x02e7ac540409d32c90bfb51114003a9e1ff0249c', // JPG
      '0x7c07f7abe10ce8e33dc6c5ad68fe033085256a84', // icETH
      '0xaa6e8127831c9de45ae56bb1b0d4d4da6e5665bd', // ETH x2 Flex Leverage
      '0x0b498ff89709d3838a063f1dfa463091f9801c2b', // BTC x2 Flex Leverage
    ];
  }

  async getUnderlyingTokenAddresses({
    contract,
  }: GetUnderlyingTokensParams<IndexCoopToken>): Promise<string | string[]> {
    return contract.getComponents();
  }

  async getPrice({ contract, appToken }: GetPriceParams<IndexCoopToken>) {
    const tokensWithLiquidityRaw = await Promise.all(
      appToken.tokens.map(async underlyingToken => {
        const balanceOfRaw = await contract.getTotalComponentRealUnits(underlyingToken.address);
        const balanceOf = Number(balanceOfRaw) / 10 ** underlyingToken.decimals;

        return {
          liquidity: balanceOf * underlyingToken.price,
          baseToken: underlyingToken,
        };
      }),
    );

    const tokensWithLiquidity = _.compact(tokensWithLiquidityRaw);
    const liquidityPerToken = tokensWithLiquidity.map(x => x.liquidity);

    return _.sum(liquidityPerToken);
  }

  async getPricePerShare() {
    return 1;
  }

  getLiquidity({ appToken }: GetDataPropsParams<IndexCoopToken>) {
    return appToken.supply * appToken.price;
  }

  getReserves({ appToken }: GetDataPropsParams<IndexCoopToken>) {
    return (appToken.pricePerShare as number[]).map(v => v * appToken.supply);
  }

  getApy(): number | Promise<number> {
    return 0;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<IndexCoopToken>) {
    return appToken.symbol;
  }
}
