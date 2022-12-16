import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { TokemakContractFactory, TokemakReactor } from '../contracts';

@PositionTemplate()
export class EthereumTokemakReactorTokenFetcher extends AppTokenTemplatePositionFetcher<TokemakReactor> {
  groupLabel = 'Reactors';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TokemakContractFactory) private readonly contractFactory: TokemakContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TokemakReactor {
    return this.contractFactory.tokemakReactor({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return [
      '0xd3d13a578a53685b4ac36a1bab31912d2b2a2f36', // tWETH
      '0x04bda0cf6ad025948af830e75228ed420b0e860d', // tUSDC
      '0xa760e26aa76747020171fcf8bda108dfde8eb930', // tTOKE (Legacy)
      '0x1b429e75369ea5cd84421c1cc182cee5f3192fd3', // tUNI-TOKE/ETH
      '0x8858a739ea1dd3d80fe577ef4e0d03e88561faa3', // tSLP-TOKE/ETH
      '0xe7a7d17e2177f66d035d9d50a7f48d8d8e31532d', // tOHM
      '0xd3b5d9a561c293fb42b446fe7e237daa9bf9aa84', // tALCX
      '0x15a629f0665a3eb97d7ae9a7ce7abf73aeb79415', // tTCR
      '0xadf15ec41689fc5b6dca0db7c53c9bfe7981e655', // tFXS
      '0xf49764c9c5d644ece6ae2d18ffd9f1e902629777', // tSUSHI
      '0x808d3e6b23516967ceae4f17a5f9038383ed5311', // tFOX
      '0xdc0b02849bb8e0f126a216a2840275da829709b0', // tAPW
      '0x41f6a95bacf9bc43704c4a4902ba5473a8b00263', // tgOHM
      '0x0ce34f4c26ba69158bc2eb8bf513221e44fdfb75', // tDAI
      '0xeff721eae19885e17f5b80187d6527aad3ffc8de', // tSNX
      '0x2fc6e9c1b2c07e18632efe51879415a580ad22e1', // tGAMMA
      '0x03dcccd17cc36ee61f9004bcfd7a85f58b2d360d', // tFEI
      '0x2e9f9becf5229379825d0d3c1299759943bd4fed', // tMIM
      '0x482258099de8de2d0bda84215864800ea7e6b03d', // tWORMUST
      '0x9eee9ee0cbd35014e12e1283d9388a40f69797a3', // tLUSD
      '0x94671a3cee8c7a12ea72602978d1bb84e920efb2', // tFRAX
      '0x7211508d283353e77b9a7ed2f22334c219ad4b4c', // tALUSD
      '0x061aee9ab655e73719577ea1df116d7139b2a7e7', // tMYC
    ];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<TokemakReactor>) {
    return [{ address: await contract.underlyer(), network: this.network }];
  }
}
