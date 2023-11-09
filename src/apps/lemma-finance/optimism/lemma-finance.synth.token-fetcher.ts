import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetUnderlyingTokensParams,
  DefaultAppTokenDataProps,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { LemmaFinanceViemContractFactory } from '../contracts';
import { LemmaSynth } from '../contracts/viem';

export type LemmaFinanceSynthDefinition = {
  address: string;
  perpAddress: string;
};

const synthDefinitions = [
  {
    address: '0x3bc414fa971189783acee4dee281067c322e3412', // lETH
    perpAddress: '0x29b159ae784accfa7fb9c7ba1de272bad75f5674',
  },
  {
    address: '0x8a641696caf0f59bb7a53cf8d2dc943ed95229a6', // lWBTC
    perpAddress: '0xe161c6c9f2fc74ac97300e6f00648284d83cbd19',
  },
  {
    address: '0x5c39a4a368ab3c3239d20eb4219e0361bd2ad092', // lLINK
    perpAddress: '0xdd4d71d3563c24e38525661896e1d01fd8c2c9a5',
  },
  {
    address: '0x546ba811099883bef35fa360e7ded8af439831f3', // lCRV
    perpAddress: '0x119f85ecfcfbc1d7033d266192626202df7dbdf2',
  },
  {
    address: '0xd1a988b024c55d7baabb07fd531d63a4e19e3b4c', // lPERP
    perpAddress: '0x13c214b430fe304c4c6437f3564a690cd4e4f23b',
  },
  {
    address: '0xa7c657a94eb9571f4e94f49943af1130e6d7337c', // lAAVE
    perpAddress: '0xfe1eb36d31ead771fd5e051ee8cc424db6416567',
  },
];

@PositionTemplate()
export class OptimismLemmaFinanceSynthTokenFetcher extends AppTokenTemplatePositionFetcher<
  LemmaSynth,
  DefaultAppTokenDataProps,
  LemmaFinanceSynthDefinition
> {
  groupLabel = 'Synths';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LemmaFinanceViemContractFactory) protected readonly contractFactory: LemmaFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.lemmaSynth({ address, network: this.network });
  }

  async getDefinitions() {
    return synthDefinitions;
  }

  async getAddresses({ definitions }: GetAddressesParams<LemmaFinanceSynthDefinition>) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
    multicall,
  }: GetUnderlyingTokensParams<LemmaSynth, LemmaFinanceSynthDefinition>) {
    const synthContract = this.contractFactory.lemmaSynth({ address: definition.address, network: this.network });
    const perpContract = this.contractFactory.lemmaPerp({ address: definition.perpAddress, network: this.network });

    const [collateralTokenAddress, usdcAddress] = await Promise.all([
      multicall.wrap(synthContract).read.tailCollateral(),
      multicall.wrap(perpContract).read.usdc(),
    ]);

    return [
      { address: usdcAddress, network: this.network },
      { address: collateralTokenAddress, network: this.network },
    ];
  }

  async getPricePerShare({
    definition,
    multicall,
    appToken,
  }: GetPricePerShareParams<LemmaSynth, DefaultAppTokenDataProps, LemmaFinanceSynthDefinition>) {
    const perpContract = this.contractFactory.lemmaPerp({ address: definition.perpAddress, network: this.network });
    const indexPriceRaw = await multicall.wrap(perpContract).read.getIndexPrice();
    const indexPrice = Number(indexPriceRaw) / 10 ** appToken.decimals;
    return [indexPrice, 0];
  }
}
