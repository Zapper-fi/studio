import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { LemmaFinanceViemContractFactory } from '../contracts';
import { LemmaXSynth } from '../contracts/viem';

export type LemmaFinanceXSynthDefinition = {
  address: string;
  perpAddress: string;
};

const xSynthDefinitions = [
  {
    address: '0x89c4e9a23db43641e1b3c5e0691b100e64b50e32',
    perpAddress: '0x29b159ae784accfa7fb9c7ba1de272bad75f5674',
  },
  {
    address: '0x7d39583e262cbe75a1d698a6d79cd5a2958cb61d',
    perpAddress: '0xe161c6c9f2fc74ac97300e6f00648284d83cbd19',
  },
  {
    address: '0x823c55654d6e860f40070ee5625ff8b091df4269',
    perpAddress: '0xdd4d71d3563c24e38525661896e1d01fd8c2c9a5',
  },
  {
    address: '0x754e6134872d7a501ffeba6c186e187dbfdf6f4a',
    perpAddress: '0x119f85ecfcfbc1d7033d266192626202df7dbdf2',
  },
  {
    address: '0x3c7e63ba04ff4d5f0673bc93bbd9e73e9dd37ed2',
    perpAddress: '0x13c214b430fe304c4c6437f3564a690cd4e4f23b',
  },
  {
    address: '0x90356c24c1f95cf29543d45122f2554b6a74f201',
    perpAddress: '0xfe1eb36d31ead771fd5e051ee8cc424db6416567',
  },
];

@PositionTemplate()
export class OptimismLemmaFinanceXSynthTokenFetcher extends AppTokenTemplatePositionFetcher<
  LemmaXSynth,
  DefaultAppTokenDataProps,
  LemmaFinanceXSynthDefinition
> {
  groupLabel = 'xSynths';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LemmaFinanceViemContractFactory) protected readonly contractFactory: LemmaFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.lemmaXSynth({ address, network: this.network });
  }

  async getDefinitions() {
    return xSynthDefinitions;
  }

  async getAddresses({ definitions }: GetAddressesParams<LemmaFinanceXSynthDefinition>) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
    multicall,
  }: GetUnderlyingTokensParams<LemmaXSynth, LemmaFinanceXSynthDefinition>) {
    const perpContract = this.contractFactory.lemmaPerp({
      address: definition.perpAddress,
      network: this.network,
    });

    const [collateralTokenAddress, usdcAddress] = await Promise.all([
      multicall.wrap(perpContract).read.usdlCollateral(),
      multicall.wrap(perpContract).read.usdc(),
    ]);

    return [
      { address: usdcAddress, network: this.network },
      { address: collateralTokenAddress, network: this.network },
    ];
  }

  async getPricePerShare({
    contract,
    appToken,
  }: GetPricePerShareParams<LemmaXSynth, DefaultAppTokenDataProps, LemmaFinanceXSynthDefinition>) {
    const pricePerShareRaw = await contract.read.assetsPerShare();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.decimals;
    return [pricePerShare, 0];
  }
}
